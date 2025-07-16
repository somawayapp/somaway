import express from "express";
import axios from "axios";
import moment from "moment";
import EntryModel from "../models/Entry.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.MPESA_CALLBACK_URL;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;



// --- Helper Function for Hashing (NEW) ---
function hashPhoneNumber(phone) {
  // Always hash the *formatted* phone number
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
const MAX_PARTICIPANTS = 1000000; // 1 Million participants/Ksh
const CURRENT_CYCLE = 1; // You might want to manage this dynamically later

// --- Main STK Push route ---

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

  // --- HASH THE PHONE FOR LOOKUP (NEW) ---
  const phoneNumberHash = hashPhoneNumber(phone);
  console.log(`Checking for existing entry for phone hash: ${phoneNumberHash} in cycle: ${CURRENT_CYCLE}`);
  // --- END HASHING FOR LOOKUP ---

  // Check current participant count and total confirmed amount
  try {
    const totalParticipants = await EntryModel.countDocuments({
      status: "Completed",
      cycle: CURRENT_CYCLE,
    });
    const totalAmountConfirmed = (
      await EntryModel.aggregate([
        { $match: { status: "Completed", cycle: CURRENT_CYCLE } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
    )[0]?.total || 0;

    if (totalParticipants >= MAX_PARTICIPANTS && totalAmountConfirmed >= MAX_PARTICIPANTS) {
      return res.status(403).json({
        success: false,
        error: "Maximum participants reached for this cycle. No more entries allowed.",
      });
    }

    // Check for duplicate phone number (already initiated or completed transaction)
    const existingEntry = await EntryModel.findOne({
      phoneNumberHash: phoneNumberHash, // <<<--- NOW USING THE HASH FOR LOOKUP
      cycle: CURRENT_CYCLE,
    });

    if (existingEntry) {
      console.log(`Existing entry found (encrypted): ${JSON.stringify(existingEntry)}`);
      // --- ADDED DECRYPTED LOGGING HERE ---
      try {
          const decryptedPhone = decrypt(existingEntry.phone);
          const decryptedName = decrypt(existingEntry.name);
          console.log(`Existing entry found (decrypted): { phone: '${decryptedPhone}', name: '${decryptedName}', status: '${existingEntry.status}' }`);
      } catch (decryptError) {
          console.error("Error decrypting existing entry for logging:", decryptError.message);
      }
      // --- END ADDED DECRYPTED LOGGING ---

      

      if (existingEntry.status === "Completed") {
        return res.status(409).json({
          success: false,
          error: "This phone number has already successfully participated in this cycle.",
        });
      } else if (existingEntry.status === "Pending") {
        return res.status(200).json({
          success: true,
          error: "A transaction for this phone number is already pending. Please complete it or try again later.",
        });

    



        
      }
    } else {
        console.log("No existing entry found for this phone number in the current cycle.");
    }
  } catch (dbError) {
    console.error("Database check error:", dbError);
    return res.status(500).json({ success: false, error: "Server error during entry check." });
  }
  // ... (rest of your STK push code) ...


  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  try {
    const token = await getAccessToken();

    // Create a pending entry in the database BEFORE sending STK push
    // Store encrypted name and phone
    const newEntry = await EntryModel.create({
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
      status: "Pending", // Set initial status to pending
      cycle: CURRENT_CYCLE,
      // transactionId will be updated after successful STK push initiation
    });

    // --- ADD THIS LOGGING HERE ---
    console.log("--- STK Push Request Payload Being Sent to Safaricom ---");
    console.log("BusinessShortCode:", shortCode);
    console.log("Password:", password);
    console.log("Timestamp:", timestamp);
    console.log("TransactionType:", "CustomerPayBillOnline");
    console.log("Amount:", amount);
    console.log("PartyA:", phone);
    console.log("PartyB:", shortCode);
    console.log("PhoneNumber:", phone);
    console.log("CallBackURL (THIS IS KEY):", callbackURL); // <--- THIS IS THE LOG TO CHECK
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
        CallBackURL: callbackURL, // This variable is defined at the top of your file
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
      // Update the pending entry with the CheckoutRequestID
      newEntry.transactionId = stkRes.data.CheckoutRequestID;
      await newEntry.save();
      res.json({ success: true, message: "STK push sent", data: stkRes.data });
    } else {
      // If STK push failed, remove the pending entry or mark it as failed
      await EntryModel.deleteOne({ _id: newEntry._id }); // Or update status to 'Failed'
      res.status(400).json({ success: false, error: stkRes.data.ResponseDescription || "Failed to initiate STK push" });
    }
  } catch (error) {
    console.error("STK Push error:", error?.response?.data || error.message || error);
    // If an error occurred before sending STK or while updating entry, clean up
    // This assumes newEntry might not exist if error was early
    if (newEntry && newEntry._id) {
      await EntryModel.deleteOne({ _id: newEntry._id });
    }
    res.status(500).json({ success: false, error: "Failed to initiate STK push due to a server error." });
  }
});

// --- M-Pesa Callback Route ---
router.post("/callback", async (req, res) => {
  console.log("M-Pesa Callback received:", JSON.stringify(req.body, null, 2));

  const { Body } = req.body;
  const { stkCallback } = Body;

  if (!stkCallback) {
    console.warn("Invalid M-Pesa callback format.");
    return res.json({ ResultCode: 1, ResultDesc: "Invalid callback format" });
  }

  // Extract CheckoutRequestID directly from stkCallback
  const CheckoutRequestID = stkCallback.CheckoutRequestID;
  const ResultCode = stkCallback.ResultCode; // Also directly from stkCallback
  const resultDesc = stkCallback.ResultDesc; // Also directly from stkCallback

  // Extract other items from CallbackMetadata.Item
  const callbackItems = stkCallback.CallbackMetadata?.Item?.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {}) || {};

  const MpesaReceiptNumber = callbackItems.MpesaReceiptNumber;
  const PhoneNumber = callbackItems.PhoneNumber;
  const Amount = callbackItems.Amount; // Though you are just setting it to 1 KES, good to extract for validation

  // Add more detailed logging here to confirm extraction
  console.log(`Extracted: CheckoutRequestID=${CheckoutRequestID}, ResultCode=${ResultCode}, MpesaReceiptNumber=${MpesaReceiptNumber}, PhoneNumber=${PhoneNumber}, Amount=${Amount}, ResultDesc=${resultDesc}`);


  try {
    const entry = await EntryModel.findOne({ transactionId: CheckoutRequestID });

    if (!entry) {
      console.error(`Entry not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return res.json({ ResultCode: 1, ResultDesc: "Entry not found in database" });
    }

    if (ResultCode === 0) {
      // Payment successful
      entry.status = "Completed";
      entry.mpesaReceiptNumber = MpesaReceiptNumber;
      // You might want to verify the phone number and amount match with the encrypted values
      // For now, we trust M-Pesa's callback.
      await entry.save();
      console.log(`Payment for ${decrypt(entry.phone)} successful. Receipt: ${MpesaReceiptNumber}`);
    } else {
      // Payment failed or cancelled
      entry.status = "Failed";
      // Optionally store ResultDesc for debugging
      console.log(`Payment for ${decrypt(entry.phone)} failed/cancelled. ResultCode: ${ResultCode}, Desc: ${resultDesc}`);
    }
    await entry.save(); // Save the updated status

    res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
    res.json({ ResultCode: 1, ResultDesc: "Internal server error during callback processing" });
  }
});





// --- API to get current cycle status (for frontend to display) ---
router.get("/cycle-status", async (req, res) => {
  try {
    const totalParticipants = await EntryModel.countDocuments({
      status: "Completed",
      cycle: CURRENT_CYCLE,
    });
    const totalAmountConfirmed = (
      await EntryModel.aggregate([
        { $match: { status: "Completed", cycle: CURRENT_CYCLE } },
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
      cycle: CURRENT_CYCLE,
    });
  } catch (error) {
    console.error("Error fetching cycle status:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cycle status." });
  }
});


export default router;


