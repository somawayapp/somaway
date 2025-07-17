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
  console.log(`Checking for existing entry for phone hash: ${phoneNumberHash} in cycle: ${CURRENT_CYCLE}`);

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
      phoneNumberHash: phoneNumberHash,
      cycle: CURRENT_CYCLE,
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
      } else if (existingEntry.status === "Pending") {
       console.log("Pending entry found. Deleting it to allow new transaction.");
       await EntryModel.deleteOne({ _id: existingEntry._id });
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

  try {
    const token = await getAccessToken();

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
      status: "Pending",
      cycle: CURRENT_CYCLE,
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
    console.log("CallBackURL (THIS IS KEY):", callbackURL);
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
      res.json({ success: true, message: "STK push sent", data: stkRes.data });
    } else {
      await EntryModel.deleteOne({ _id: newEntry._id });
      res.status(400).json({ success: false, error: stkRes.data.ResponseDescription || "Failed to initiate STK push" });
    }
  } catch (error) {
    console.error("STK Push error:", error?.response?.data || error.message || error);
    if (newEntry && newEntry._id) {
      await EntryModel.deleteOne({ _id: newEntry._id });
    }
    res.status(500).json({ success: false, error: "Failed to initiate STK push due to a server error." });
  }
});


// --- M-Pesa Callback Route ---
router.post("/callback", async (req, res) => {
  console.log("M-Pesa Callback received:", JSON.stringify(req.body, null, 2));
  res.status(200).send('OK');

  const { Body } = req.body;
  const { stkCallback } = Body;

  if (!stkCallback) {
    console.warn("Invalid M-Pesa callback format.");
    return; // Do not send JSON response after res.status(200).send('OK');
  }

  const CheckoutRequestID = stkCallback.CheckoutRequestID;
  const ResultCode = stkCallback.ResultCode;
  const resultDesc = stkCallback.ResultDesc;

  const callbackItems = stkCallback.CallbackMetadata?.Item?.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {}) || {};

  const MpesaReceiptNumber = callbackItems.MpesaReceiptNumber;
  const PhoneNumber = callbackItems.PhoneNumber;
  const Amount = callbackItems.Amount;

  console.log(`Extracted from callback: CheckoutRequestID=${CheckoutRequestID}, ResultCode=${ResultCode}, MpesaReceiptNumber=${MpesaReceiptNumber}, PhoneNumber=${PhoneNumber}, Amount=${Amount}, ResultDesc=${resultDesc}`);

  try {
    const entry = await EntryModel.findOne({ transactionId: CheckoutRequestID });

    if (!entry) {
      console.error(`Entry not found for CheckoutRequestID: ${CheckoutRequestID} in database.`);
      return;
    }

    if (ResultCode === 0) {
      entry.status = "Completed";
      entry.mpesaReceiptNumber = MpesaReceiptNumber;
      // Optional: Add more validation here, e.g., check if Amount matches expected amount
      // const decryptedPhone = decrypt(entry.phone); // If you need to log it
      console.log(`Payment for CheckoutRequestID ${CheckoutRequestID} successful. Receipt: ${MpesaReceiptNumber}`);
    } else {
      entry.status = "Failed";
      entry.failReason = resultDesc; // Store the reason for failure
      console.log(`Payment for CheckoutRequestID ${CheckoutRequestID} failed/cancelled. ResultCode: ${ResultCode}, Desc: ${resultDesc}`);
    }
    await entry.save();
    console.log(`Entry for CheckoutRequestID ${CheckoutRequestID} updated to status: ${entry.status}.`);

  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
  }
});

// --- NEW: API to query STK Push transaction status ---
router.post("/query-stk-status", async (req, res) => {
  const { checkoutRequestID } = req.body;

  if (!checkoutRequestID) {
    return res.status(400).json({ success: false, error: "checkoutRequestID is required." });
  }

  try {
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");
    const token = await getAccessToken();

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
    const entry = await EntryModel.findOne({ transactionId: checkoutRequestID });

    if (entry) {
      if (queryRes.data.ResponseCode === "0") {
        // ResponseCode 0 usually means the query was successful,
        // now check the ResultCode from the detailed response for transaction status
        const ResultCode = queryRes.data.ResultCode; // This might be nested, check Daraja docs carefully
        const ResultDesc = queryRes.data.ResultDesc;

        if (ResultCode === "0") { // The actual transaction was successful
          entry.status = "Completed";
          entry.mpesaReceiptNumber = queryRes.data.MpesaReceiptNumber; // M-Pesa Receipt if available
          console.log(`Reconciled: Transaction ${checkoutRequestID} is Completed.`);
        } else if (ResultCode === "1032") { // User cancelled
          entry.status = "Cancelled";
          console.log(`Reconciled: Transaction ${checkoutRequestID} was Cancelled by user.`);
        } else { // Other failure codes
          entry.status = "Failed";
          entry.failReason = ResultDesc;
          console.log(`Reconciled: Transaction ${checkoutRequestID} Failed with code ${ResultCode}.`);
        }
      } else if (queryRes.data.ResponseCode === "1" && queryRes.data.ResultDesc === "The transaction is not found") {
        // This can happen if the STK push was initiated but never completed
        // or if the request was too old. You might want to mark it as 'Failed' or 'Expired'.
        entry.status = "Failed";
        entry.failReason = "Transaction not found by Safaricom (might have expired or never completed)";
        console.log(`Reconciled: Transaction ${checkoutRequestID} not found by Safaricom.`);
      } else {
        // Generic query failure
        entry.status = "Query_Failed"; // A new status to indicate query itself failed
        entry.failReason = queryRes.data.ResponseDescription || "Unknown query error";
        console.log(`Reconciled: Query for ${checkoutRequestID} failed: ${entry.failReason}.`);
      }
      await entry.save();
    } else {
      console.warn(`Query received for CheckoutRequestID ${checkoutRequestID} but no matching entry found in DB.`);
    }

    res.json({ success: true, data: queryRes.data, dbStatus: entry ? entry.status : "Not Found in DB" });

  } catch (error) {
    console.error("STK Push Query error:", error?.response?.data || error.message || error);
    res.status(500).json({ success: false, error: "Failed to query STK push status due to a server error." });
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