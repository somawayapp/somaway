

// --- routes/mpesa.route.js ---
import express from "express";
import axios from "axios";
import moment from "moment";
import PhoneModel from "../models/Phone.model.js";
import { encrypt } from "../utils/encryption.js";

const router = express.Router();

const consumerKey = process.env.MPESA_KEY;
const consumerSecret = process.env.MPESA_SECRET;
const shortCode = "174379";
const passkey = process.env.MPESA_PASSKEY;
const callbackURL = "https://makesomaway.com/mpesa/callback";

function formatPhoneNumber(phone) {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "254" + digits.slice(1);
  else if (digits.startsWith("7")) digits = "254" + digits;
  else if (digits.startsWith("+254")) digits = digits.slice(1);
  if (digits.length !== 12) return null;
  return digits;
}

const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token;
};

router.post("/stk-push", async (req, res) => {
  let { phone, name } = req.body;
  const amount = 1;

  if (!phone || !name) return res.status(400).json({ success: false, error: "Name and phone are required" });

  phone = formatPhoneNumber(phone);
  if (!phone) return res.status(400).json({ success: false, error: "Invalid phone number" });

  const encryptedPhone = encrypt(phone);
  const encryptedName = encrypt(name);

  const count = await PhoneModel.countDocuments();
  const sum = await PhoneModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  const totalAmount = sum[0]?.total || 0;

  if (count >= 1_000_000 || totalAmount >= 1_000_000) {
    return res.status(403).json({ success: false, error: "Maximum entry limit reached." });
  }

  const exists = await PhoneModel.findOne({ phone: encryptedPhone });
  if (exists) return res.status(409).json({ success: false, error: "Phone already used." });

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  try {
    const token = await getAccessToken();
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
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (stkRes.data.ResponseCode === "0") {
      await PhoneModel.create({
        name: encryptedName,
        phone: encryptedPhone,
        amount,
        location: {
          country: req.headers["x-vercel-ip-country"] || "Unknown",
          city: req.headers["x-vercel-ip-city"] || "Unknown",
          region: req.headers["x-vercel-ip-country-region"] || "Unknown",
          timezone: req.headers["x-vercel-ip-timezone"] || "Unknown",
        },
      });
    }

    res.json({ success: true, message: "STK push sent", data: stkRes.data });
  } catch (err) {
    console.error("STK Error:", err?.response?.data || err);
    res.status(500).json({ success: false, error: "Payment initiation failed." });
  }
});

// Stats route
router.get("/stash-stats", async (req, res) => {
  const count = await PhoneModel.countDocuments();
  const sum = await PhoneModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  res.json({ count, totalAmount: sum[0]?.total || 0 });
});

export default router;
