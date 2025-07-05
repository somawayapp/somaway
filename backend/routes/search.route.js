// routes/search.router.js
import express from "express";
import EntryModel from "../models/Entry.model.js";
import crypto from "crypto"; // For hashing and decryption

const router = express.Router();

// IMPORTANT: Ensure ENCRYPTION_KEY is set as a Vercel Environment Variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "8ab21ec1dd828cc6409d0ed55b876e0530dfbccd67e56f1318e684e555896f3d";
const IV_LENGTH = 16;

// --- Helper Functions (copied from mpesa.router.js, or import if possible) ---

// Function to format phone number (Crucial for consistent hashing)
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.startsWith("0")) {
    cleanPhone = "254" + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith("7")) {
    cleanPhone = "254" + cleanPhone;
  } else if (cleanPhone.startsWith("+254")) {
    cleanPhone = cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith("254")) {
    return null; // Invalid format
  }

  if (cleanPhone.length !== 12) {
    return null;
  }
  return cleanPhone;
};

// Function to hash phone number
function hashPhoneNumber(phone) {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Function to decrypt (needed for displaying found data)
function decrypt(text) {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set. Cannot decrypt.");
  }
  const textParts = text.split(":");
  if (textParts.length !== 2) {
      throw new Error("Invalid encrypted text format.");
  }
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Function to mask phone number (for displaying search results securely)
function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length < 5) {
    return "***";
  }
  const len = phoneNumber.length;
  const firstPart = phoneNumber.substring(0, 5);
  const lastPart = phoneNumber.substring(len - 3);
  const stars = '*'.repeat(len - 5 - 3);
  return `${firstPart}${stars}${lastPart}`;
}


// --- Search Endpoint ---
// In search.router.js, inside the GET / route:
router.get("/", async (req, res) => {
    let { phone, cycle } = req.query;

    console.log(`Received search request - Raw phone: ${phone}, Cycle: ${cycle}`);

    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
        console.log(`Invalid format for phone: ${phone}`);
        return res.status(400).json({ success: false, message: "Invalid phone number format." });
    }
    console.log(`Formatted phone: ${formattedPhone}`);

    const phoneNumberHash = hashPhoneNumber(formattedPhone);
    console.log(`Hashed phone for search: ${phoneNumberHash}`);

    // ... rest of your code
  try {
    // 4. Build query object
    const query = {
      phoneNumberHash: phoneNumberHash,
      // Only search for 'Completed' status by default, as requested "listed in the stash"
      status: "Completed"
    };

    // If cycle is provided, add it to the query
    if (cycle) {
      query.cycle = parseInt(cycle); // Ensure cycle is a number
      if (isNaN(query.cycle)) {
        return res.status(400).json({ success: false, message: "Invalid cycle number." });
      }
    }

    // 5. Perform the search using the hash
    const foundEntry = await EntryModel.findOne(query).lean();

    if (foundEntry) {
      console.log("Entry found in search. Decrypting for display.");
      // Decrypt and mask found data
      let decryptedName = "Error";
      let decryptedPhone = "Error";
      try {
        decryptedName = decrypt(foundEntry.name);
      } catch (e) {
        console.error(`Error decrypting name for found entry ${foundEntry._id}:`, e.message);
      }
      try {
        decryptedPhone = decrypt(foundEntry.phone);
        // Only mask if decryption was successful
        decryptedPhone = maskPhoneNumber(decryptedPhone);
      } catch (e) {
        console.error(`Error decrypting phone for found entry ${foundEntry._id}:`, e.message);
      }

      res.json({
        success: true,
        message: "Entry found!",
        data: {
          name: decryptedName,
          phone: decryptedPhone, // Masked phone
          status: foundEntry.status,
          cycle: foundEntry.cycle,
          createdAt: foundEntry.createdAt,
          // You might choose to expose other non-sensitive fields
        }
      });
    } else {
      console.log("No entry found for the provided details.");
      res.status(404).json({
        success: false,
        message: "No entry found for this phone number in the completed stash for the specified cycle."
      });
    }

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Server error during search." });
  }
});

export default router;