// server.js (or mpesaController.js)
const express = require("express");
const axios = require("axios");
const moment = require("moment");
const router = express.Router();

const consumerKey = "z065hfN3Nna7pdDvG0GbtQljszI1tPtjEmxORAmzfRH4ObDd";
const consumerSecret = "z7EGGOUkyiAmwP6HVLA2jQzMKZVYADU4Er7D9lBpiAWuIAM35kHgyAWvKb9FpZui";
const shortCode = "174379"; // For sandbox
const passkey = "Oe28D4x6ndfKH7jSfjCd/N2XkHcq59PwfxrMg+JCNbfEZ95zgNHR3cBSrGbwVTQgm0nvtDDCFppoNmk+0eCv5D5X0p4vfY+GMLrkd8iKd1isQzxf1FeHwBRuJhkXxa14pttvdFPmZgfQE41blN/Re16GN+ABApp8GPf0muEffViAaPuKKu0oz6gHmMbaPl+NMiybN2qXRg5r7d0y22QIWgDzj4nEBRzsupy1M4f8X2Chincj/1+aYdN8IOWTgpRWBF6LqCosot274Vx+U9lL0PkmiLZYZEQ/HfNoyZoSHBL77Y3Aqls8207tp9BQiWF93y9YfR2XOQSsd1mkR/GEYA==";
const callbackURL = "https://makesomaway.com/mpesa/callback"; // Can be mocked for now
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
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  return res.data.access_token;
};

// STK Push
router.post("/stk-push", async (req, res) => {
  let { phone } = req.body;
  const amount = 1;
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  phone = formatPhoneNumber(phone);

  if (!phone) {
    return res.status(400).json({ success: false, error: "Invalid phone number format" });
  }

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
        TransactionDesc: "Join Game",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ success: true, message: "STK push sent", data: stkRes.data });
  } catch (error) {
    console.error("STK Push error:", error?.response?.data || error);
    res.status(500).json({ success: false, error: "Failed to initiate STK push" });
  }
});

export default router;

