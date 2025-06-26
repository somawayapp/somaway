import express from "express";
import axios from "axios";
import moment from "moment";
import PhoneModel from "../models/Phone.model.js";


const router = express.Router();

const consumerKey = "z065hfN3Nna7pdDvG0GbtQljszI1tPtjEmxORAmzfRH4ObDd";
const consumerSecret = "z7EGGOUkyiAmwP6HVLA2jQzMKZVYADU4Er7D9lBpiAWuIAM35kHgyAWvKb9FpZui";
const shortCode = "174379"; // For sandbox
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const callbackURL = "https://makesomaway.com/mpesa/callback"; // Can be mocked for now




// Helper: Format phone number to 2547XXXXXXXX
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

  // Optionally validate length
  if (digits.length !== 12) {
    return null;
  }

  return digits;
}

// Get access token

const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  console.log("Auth header:", `Basic ${auth}`);
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  return res.data.access_token;
};




// Main STK Push route
router.post("/stk-push", async (req, res) => {
  let { phone, name } = req.body;
  const amount = 1;

  console.log("Incoming body:", req.body); // 🔍 debug log

  // Validation
  if (!phone || !name) {
    return res.status(400).json({ success: false, error: "Name and phone are required" });
  }

  phone = formatPhoneNumber(phone);
  if (!phone) {
    return res.status(400).json({ success: false, error: "Invalid phone number format" });
  }

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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Safaricom STK response:", stkRes.data); // 🔍 debug log

    if (stkRes.data.ResponseCode === "0") {
      // Only create DB entry if STK push was accepted
      const phoneRecord = {
        name,
        phone,
        amount,
        location: {
          country: req.headers["x-vercel-ip-country"] || "Unknown",
          city: req.headers["x-vercel-ip-city"] || "Unknown",
          region: req.headers["x-vercel-ip-country-region"] || "Unknown",
          timezone: req.headers["x-vercel-ip-timezone"] || "Unknown",
        },
      };

      console.log("Saving to DB:", phoneRecord); // 🔍 debug log

      await PhoneModel.create(phoneRecord);
    }

    res.json({ success: true, message: "STK push sent", data: stkRes.data });
  } catch (error) {
    console.error("STK Push error:", error?.response?.data || error); // full error log
    res.status(500).json({ success: false, error: "Failed to initiate STK push" });
  }
});

export default router;



