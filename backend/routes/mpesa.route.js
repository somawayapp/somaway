// routes/mpesa.router.js
import express from "express";
import axios from "axios";
import moment from "moment";
import EntryModel from "../models/Entry.model.js"; // Import the new Entry model
import crypto from "crypto"; // For encryption

const router = express.Router();

const consumerKey = "z065hfN3Nna7pdDvG0GbtQljszI1tPtjEmxORAmzfRH4ObDd";
const consumerSecret = "z7EGGOUkyiAmwP6HVLA2jQzMKZVYADU4Er7D9lBpiAWuIAM35kHgyAWvKb9FpZui";
const shortCode = "174379"; // For sandbox
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const callbackURL = "https://somawayapi.vercel.app/mpesa/callback";


// Encryption Configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex"); // Use a strong, environment-variable-stored key in production
const IV_LENGTH = 16; // For AES-256-CBC

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
      phone: encrypt(phone), // Compare with encrypted phone
      cycle: CURRENT_CYCLE,
    });

    if (existingEntry) {
      if (existingEntry.status === "Completed") {
        return res.status(409).json({
          success: false,
          error: "This phone number has already successfully participated in this cycle.",
        });
      } else if (existingEntry.status === "Pending") {
        return res.status(409).json({
          success: false,
          error: "A transaction for this phone number is already pending. Please complete it or try again later.",
        });
      }
    }
  } catch (dbError) {
    console.error("Database check error:", dbError);
    return res.status(500).json({ success: false, error: "Server error during entry check." });
  }

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
    console.log("M-Pesa Callback - Raw Request Body:", JSON.stringify(req.body, null, 2));
  

  const { Body } = req.body;
  const { stkCallback } = Body;

  if (!stkCallback) {
    console.warn("Invalid M-Pesa callback format.");
    return res.json({ ResultCode: 1, ResultDesc: "Invalid callback format" });
  }

  const { CheckoutRequestID, ResultCode, MpesaReceiptNumber, PhoneNumber, Amount } = stkCallback.CallbackMetadata?.Item?.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {}) || {};

  const resultDesc = stkCallback.ResultDesc;

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


