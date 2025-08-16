import express from "express";
import axios from "axios";
import moment from "moment";
import G2entryModel from "../../models/Entries/G2entry.model.js";
import G2cycleModel from "../../models/Cycles/G2cycle.model.js";
import crypto from "crypto";
import dotenv from "dotenv";



dotenv.config();

const router = express.Router();

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.MPESA_CALLBACK_BASE_URL + "/g2/callback";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;


// --- Helper Function for Hashing ---
function hashPhoneNumber(phone) {
  return crypto.createHash('sha256').update(phone).digest('hex');
}


// --- Helper Functions for Encryption ---
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// --- Helper: Format phone number to 2547XXXXXXXX ---
function formatPhoneNumber(phone) {
  if (!phone) return null;

  let digits = phone.replace(/\D/g, ""); // Remove non-digit chars

  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  } else if (digits.startsWith("7")) {
    digits = "254" + digits;
  } else if (digits.startsWith("+254")) {
    digits = digits.slice(1); // remove plus sign
  }

  // Optionally validate length and ensure it's a mobile number
  if (digits.length !== 12 || !digits.startsWith("2547")) {
    return null;
  }

  return digits;
}

// --- Get access token ---
const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return res.data.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error.response?.data || error.message);
    throw new Error("Failed to get M-Pesa access token");
  }
};

// --- Cycle Configuration ---
const MAX_PARTICIPANTS = 100; //  participants/Ksh



async function getCurrentCycle() {
  let cycle = await G2cycleModel.findOne();
  if (!cycle) {
    cycle = await G2cycleModel.create({ number: 1 }); // first cycle starts at 1
  }
  return cycle;
}




async function incrementCycle() {
  let cycle = await getCurrentCycle();
  cycle.number += 1;
  await cycle.save();
  console.log(`Cycle incremented to: ${cycle.number}`);
  return cycle.number;
}

// --- Function to query STK Push transaction status (extracted for reusability) ---
async function queryStkStatus(checkoutRequestID) {
  if (!checkoutRequestID) {
    console.error("queryStkStatus called without checkoutRequestID.");
    return { success: false, error: "checkoutRequestID is required." };
  }

  try {
    const timestamp = moment().format("YYYYMMDDHHmmss");
    // Ensure shortCode, passkey are defined in scope or imported
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");
    const token = await getAccessToken(); // Ensure getAccessToken is defined

    const queryRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`STK Push Query response for ${checkoutRequestID}:`, queryRes.data);

    // Update your database based on the query response
    const entry = await G2entryModel.findOne({ transactionId: checkoutRequestID });

    if (entry) {
      if (queryRes.data.ResponseCode === "0") {
        const ResultCode = queryRes.data.ResultCode;
        const ResultDesc = queryRes.data.ResultDesc;

        if (ResultCode === "0") {
          entry.status = "Completed";
          entry.mpesaReceiptNumber = queryRes.data.MpesaReceiptNumber;
          console.log(`Reconciled: Transaction ${checkoutRequestID} is Completed. DB updated.`);
        } else if (ResultCode === "1032") {
          entry.status = "Cancelled";
          entry.failReason = ResultDesc;
          console.log(`Reconciled: Transaction ${checkoutRequestID} was Cancelled by user. DB updated.`);
        } else {
          entry.status = "Failed";
          entry.failReason = ResultDesc;
          console.log(`Reconciled: Transaction ${checkoutRequestID} Failed with code ${ResultCode}. DB updated.`);
        }
      } else if (queryRes.data.ResponseCode === "1" && queryRes.data.ResultDesc === "The transaction is not found") {
        entry.status = "Failed"; // Or "Expired", depending on your business logic
        entry.failReason = "Transaction not found by Safaricom (might have expired or never completed)";
        console.log(`Reconciled: Transaction ${checkoutRequestID} not found by Safaricom. DB updated.`);
      } else {
        entry.status = "Query_Failed";
        entry.failReason = queryRes.data.ResponseDescription || "Unknown query error from M-Pesa.";
        console.log(`Reconciled: Query for ${checkoutRequestID} failed: ${entry.failReason}. DB updated.`);
      }
      await entry.save();
      return { success: true, data: queryRes.data, dbStatus: entry.status };
    } else {
      console.warn(`Query received for CheckoutRequestID ${checkoutRequestID} but no matching entry found in DB. This might indicate a race condition or a missed initial save.`);
      return { success: false, error: "Entry not found in database for reconciliation. Transaction status is unknown.", dbStatus: "Unknown_No_DB_Entry" };
    }

  // ... inside queryStkStatus catch block
} catch (error) {
  const errorResponse = error?.response;
  const errorData = errorResponse?.data;
  const contentType = errorResponse?.headers?.['content-type'];

  // Check for specific M-Pesa error code for "still processing"
  if (errorData?.errorCode === "500.001.1001") {
    console.warn(`STK query for ${checkoutRequestID} says transaction is still being processed.`);
    return { success: false, pending: true, message: "Transaction is still processing, try again shortly." };
  }

  // Handle Incapsula or other HTML responses
  if (contentType && contentType.includes('text/html')) {
    console.error(`STK Push Query error for ${checkoutRequestID}: Received HTML response (possible WAF/network issue). Full response (truncated):`, String(errorData).substring(0, 500));
    // Provide a clearer error message for the frontend
    return { success: false, error: "Failed to query STK push status due to a network/security block (e.g., Incapsula). Please try again later.", dbStatus: "Query_Failed_Network" };
  }

  // Capture M-Pesa specific errors if they come as JSON
  if (errorData && typeof errorData === 'object' && errorData.errorMessage) {
      console.error(`STK Push Query error (M-Pesa API error) for ${checkoutRequestID}:`, errorData);
      return { success: false, error: errorData.errorMessage, dbStatus: "Query_Failed_Mpesa_API" };
  }

  // General network or unexpected errors
  console.error(`STK Push Query error (internal function) for ${checkoutRequestID}:`, errorData || error.message || error);
  return { success: false, error: "Failed to query STK push status due to an unexpected internal error.", dbStatus: "Query_Failed_Internal" };
}
}

// --- Main STK Push route ---
router.post("/stk-push", async (req, res) => {
  let { phone, name } = req.body;
  const amount = 1; // Always 1 KES

  console.log("Incoming body for STK push:", req.body);

  // Validation
  if (!phone || !name) {
    return res.status(400).json({ success: false, error: "Name and phone are required" });
  }

  phone = formatPhoneNumber(phone);
  if (!phone) {
    return res.status(400).json({ success: false, error: "Invalid phone number format" });
  }


    const phoneNumberHash = hashPhoneNumber(phone);
    const cycleDoc = await getCurrentCycle();
     console.log(`Checking for existing entry for phone hash: ${phoneNumberHash} in cycle: ${cycleDoc.number}`);


  try {
    const totalParticipants = await G2entryModel.countDocuments({
      status: "Completed",
      cycle: (await getCurrentCycle()).number,
    });
    
const cycleDoc = await getCurrentCycle();



 if (totalParticipants >= MAX_PARTICIPANTS) {
  return res.status(403).json({
    success: false,
    error: "Maximum participants reached for this cycle.",
  });
}



    const existingEntry = await G2entryModel.findOne({
      phoneNumberHash: phoneNumberHash,
     cycle: (await getCurrentCycle()).number,
    });

    if (existingEntry) {
      console.log(`Existing entry found (encrypted): ${JSON.stringify(existingEntry)}`);
      try {
          const decryptedPhone = decrypt(existingEntry.phone);
          const decryptedName = decrypt(existingEntry.name);
          console.log(`Existing entry found (decrypted): { phone: '${decryptedPhone}', name: '${decryptedName}', status: '${existingEntry.status}' }`);
      } catch (decryptError) {
          console.error("Error decrypting existing entry for logging:", decryptError.message);
      }



      
     if (existingEntry.status === "Completed") {
        return res.status(409).json({
          success: false,
          error: "This phone number has already successfully participated in this cycle.",
        });
      } else if (["Pending", "Failed", "Cancelled", "Query_Failed"].includes(existingEntry.status)) {
        console.log("Pending entry found. Deleting it to allow new transaction.");
        await G2entryModel.deleteOne({ _id: existingEntry._id });
      }
    } else {
      console.log("No existing entry found for this phone number in the current cycle.");
    }
  } catch (dbError) {
    console.error("Database check error:", dbError);
    return res.status(500).json({ success: false, error: "Server error during entry check." });
  }
  
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");
  let newEntry = null; // Initialize newEntry here for broader scope

  try {
    const token = await getAccessToken();
       const cycleDoc = await getCurrentCycle();



    newEntry = await G2entryModel.create({ // Assign to newEntry here
      name: encrypt(name),
      phone: encrypt(phone),
      amount: amount,
      phoneNumberHash: phoneNumberHash,
      location: {
        country: req.headers["x-vercel-ip-country"] || "Unknown",
        city: req.headers["x-vercel-ip-city"] || "Unknown",
        region: req.headers["x-vercel-ip-country-region"] || "Unknown",
        timezone: req.headers["x-vercel-ip-timezone"] || "Unknown",
      },
      status: "Pending",
      cycle: cycleDoc.number,
    });

    console.log("--- STK Push Request Payload Being Sent to Safaricom ---");
    console.log("BusinessShortCode:", shortCode);
    console.log("Password:", password);
    console.log("Timestamp:", timestamp);
    console.log("TransactionType:", "CustomerPayBillOnline");
    console.log("Amount:", amount);
    console.log("PartyA:", phone);
    console.log("PartyB:", shortCode);
    console.log("PhoneNumber:", phone);
    console.log("CallBackURL:", callbackURL);
    console.log("AccountReference:", "Shilingi");
    console.log("TransactionDesc:", "Join cycle");
    console.log("--- End STK Push Request Payload ---");

    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: "Shilingi",
        TransactionDesc: "Join cycle",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Safaricom STK response:", stkRes.data);

    if (stkRes.data.ResponseCode === "0") {
      newEntry.transactionId = stkRes.data.CheckoutRequestID;
      await newEntry.save();

      // --- IMMEDIATE ASYNCHRONOUS STATUS CHECK (NEW LOGIC) ---
      // We are *not* waiting for this to complete before responding to the client.
      const queryDelay = 90 * 1000; 
      console.log(`Scheduling STK status check for ${newEntry.transactionId} in ${queryDelay / 1000} seconds.`);
      setTimeout(() => {
        queryStkStatus(newEntry.transactionId)
          .then(result => {
            console.log(`STK status check for ${newEntry.transactionId} completed:`, result);
          })
          .catch(queryError => {
            console.error(`Error during scheduled STK status check for ${newEntry.transactionId}:`, queryError);
          });
      }, queryDelay);
      // --- END NEW LOGIC ---

      res.json({ success: true, message: "STK push sent, status check scheduled.", data: stkRes.data });
    } else {
      await G2entryModel.deleteOne({ _id: newEntry._id });
      res.status(400).json({ success: false, error: stkRes.data.ResponseDescription || "Failed to initiate STK push" });
    }
  } catch (error) {
    console.error("STK Push error:", error?.response?.data || error.message || error);
    if (newEntry && newEntry._id) {
      await G2entryModel.deleteOne({ _id: newEntry._id });
    }
    res.status(500).json({ success: false, error: "Failed to initiate STK push due to a server error." });
  }
});


// --- M-Pesa Callback Route (Modified for current situation) ---
router.post("/callback", async (req, res) => {
  console.log("M-Pesa Callback received:", JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");

  const { Body } = req.body;
  const { stkCallback } = Body || {};

  if (!stkCallback) {
    console.warn("Invalid M-Pesa callback format.");
    return;
  }

  const CheckoutRequestID = stkCallback.CheckoutRequestID;
  const ResultCode = stkCallback.ResultCode;
  const resultDesc = stkCallback.ResultDesc;

  const callbackItems = stkCallback.CallbackMetadata?.Item?.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {}) || {};

  const MpesaReceiptNumber = callbackItems.MpesaReceiptNumber;

  console.log(`Extracted from callback: CheckoutRequestID=${CheckoutRequestID}, ResultCode=${ResultCode}, MpesaReceiptNumber=${MpesaReceiptNumber}, ResultDesc=${resultDesc}`);

  try {
    const entry = await G2entryModel.findOne({ transactionId: CheckoutRequestID });

    if (!entry) {
      console.error(`Callback: Entry not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return;
    }

    if (entry.status !== "Completed") {
      if (ResultCode === 0) {
        entry.status = "Completed";
        entry.mpesaReceiptNumber = MpesaReceiptNumber;
        console.log(`Callback: Payment successful. Receipt: ${MpesaReceiptNumber}. DB updated.`);
      } else {
        entry.status = "Failed";
        entry.failReason = resultDesc;
        console.log(`Callback: Payment failed/cancelled. ResultCode: ${ResultCode}, Desc: ${resultDesc}. DB updated.`);
      }
      await entry.save();
    } else {
      console.log(`Callback: Entry already processed. Status: ${entry.status}.`);
    }

    // === New Cycle Increment Logic ===
    if (ResultCode === 0) {
      const cycleDoc = await getCurrentCycle();

      const totalParticipants = await G2entryModel.countDocuments({
        status: "Completed",
        cycle: cycleDoc.number,
      });

      const totalAmountConfirmed = (
        await G2entryModel.aggregate([
          { $match: { status: "Completed", cycle: cycleDoc.number } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
      )[0]?.total || 0;

      if (totalParticipants >= MAX_PARTICIPANTS && totalAmountConfirmed >= MAX_PARTICIPANTS) {
        console.log(`Cycle ${cycleDoc.number} has reached max participants. Incrementing cycle...`);
        await incrementCycle();
      }
    }
    // === End New Cycle Increment Logic ===

  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
  }
});


// --- API to query STK Push transaction status (can still be used manually) ---
router.post("/query-stk-status", async (req, res) => {
  const { checkoutRequestID } = req.body;

  if (!checkoutRequestID) {
    return res.status(400).json({ success: false, error: "checkoutRequestID is required." });
  }

  const result = await queryStkStatus(checkoutRequestID);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result); // Return appropriate status code
  }
});

// --- API to get current cycle status (for frontend to display) ---
router.get("/cycle-status", async (req, res) => {
  try {
    const totalParticipants = await G2entryModel.countDocuments({
      status: "Completed",
      cycle: (await getCurrentCycle()).number,

    });
  

    const cycleDoc = await getCurrentCycle();

    const totalAmountConfirmed = (
  await G2entryModel.aggregate([
    { $match: { status: "Completed", cycle: cycleDoc.number } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ])      
    )[0]?.total || 0;

    const isMaxReached =
      totalParticipants >= MAX_PARTICIPANTS && totalAmountConfirmed >= MAX_PARTICIPANTS;

    res.json({
      success: true,
      currentParticipants: totalParticipants,
      currentAmount: totalAmountConfirmed,
      maxParticipants: MAX_PARTICIPANTS,
      isMaxReached: isMaxReached,
cycle: (await getCurrentCycle()).number,
    });
  } catch (error) {
    console.error("Error fetching cycle status:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cycle status." });
  }
});


// This would be in your API route file, e.g., api/mpesa.js or a dedicated controller

// Assuming G2entryModel is your Mongoose model for M-Pesa transactions

// New endpoint to get transaction status from DB
router.post('/get-status', async (req, res) => {
  const { checkoutRequestID } = req.body;

  if (!checkoutRequestID) {
    return res.status(400).json({ success: false, error: "CheckoutRequestID is required." });
  }

  try {
    const entry = await G2entryModel.findOne({ transactionId: checkoutRequestID });

    if (entry) {
      // Return the status and failReason directly from the database
      return res.json({
        success: true,
        transaction: {
          checkoutRequestID: entry.transactionId,
          status: entry.status,
          failReason: entry.failReason || ""
        }
      });
    } else {
      // If no entry found, it could mean it never hit your DB or expired before saving
      return res.status(404).json({ success: false, error: "Transaction not found in database.", transaction: { status: "Unknown", failReason: "Transaction record not found." } });
    }
  } catch (error) {
    console.error("Error fetching transaction from DB:", error);
    return res.status(500).json({ success: false, error: "Internal server error.", transaction: { status: "Query_Failed_Internal", failReason: "Backend database query failed." } });
  }
});

export default router;