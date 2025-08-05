import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 2;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000";

// --- IMPORTANT: SECURELY LOAD YOUR ENCRYPTION KEY ---
// DO NOT hardcode this in production. Use environment variables.
// Example: const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
// For demonstration, use a placeholder.
const ENCRYPTION_KEY = Buffer.from('THISISASUPERSECURE32BYTEKEYFORAES', 'utf8').toString('hex'); // Replace with your actual 32-byte (64 hex char) key
const IV_LENGTH = 16; // 16 bytes for AES-256-CBC

// --- Helper Functions for Encryption (from your provided code) ---
// You provided these, ensure they are consistently defined and used.
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
    if (!text || typeof text !== 'string') {
        console.warn("Decrypt function received invalid input:", text);
        return null;
    }
    try {
        const textParts = text.split(":");
        if (textParts.length !== 2) {
            console.warn("Invalid encrypted text format for decryption (missing IV or ciphertext):", text);
            return null;
        }
        const iv = Buffer.from(textParts[0], "hex");
        const encryptedText = Buffer.from(textParts[1], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Error during decryption:", error.message);
        return null;
    }
}

// Function to mask phone number
function maskPhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber.length < 7) {
        return phoneNumber; // Not long enough to mask effectively
    }
    // Example: +254712345678 -> +2547****5678
    // Adjust masking logic as needed for your specific phone number formats.
    const prefix = phoneNumber.substring(0, 5); // e.g., +2547
    const suffix = phoneNumber.substring(phoneNumber.length - 4); // e.g., 5678
    const masked = "****";
    return `${prefix}${masked}${suffix}`;
}

// GET /api/winner - Fetch current cycle winner
router.get("/", async (req, res) => {
    try {
        console.log(`[GET /api/winner] Attempting to fetch winner for cycle: ${CURRENT_CYCLE}`);
        const winner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });

        if (!winner) {
            console.log(`[GET /api/winner] No winner found for cycle: ${CURRENT_CYCLE}`);
            return res.json({ success: false, message: "No winner yet" });
        }

        // --- Decrypt and Mask Data for Response ---
        let decryptedName = null;
        let maskedPhone = null;

        if (winner.name) {
            decryptedName = decrypt(winner.name);
            console.log(`[GET /api/winner] Decrypted Name: ${decryptedName ? decryptedName.substring(0, 5) + '...' : 'Failed'}`);
        }
        if (winner.phone) {
            const tempDecryptedPhone = decrypt(winner.phone);
            if (tempDecryptedPhone) {
                maskedPhone = maskPhoneNumber(tempDecryptedPhone);
                console.log(`[GET /api/winner] Decrypted Phone: ${tempDecryptedPhone}, Masked: ${maskedPhone}`);
            } else {
                console.log(`[GET /api/winner] Phone decryption failed for: ${winner.phone}`);
            }
        }

        // Prepare the response object, ensuring sensitive raw encrypted data isn't sent
        const responseWinner = {
            // Include essential fields from the winner document
            _id: winner._id,
            entryId: winner.entryId,
            amount: winner.amount,
            location: winner.location,
            cycle: winner.cycle,
            transactionId: winner.transactionId,
            mpesaReceiptNumber: winner.mpesaReceiptNumber,
            publicRandomSeed: winner.publicRandomSeed,
            createdAt: winner.createdAt, // Assuming your model has these
            updatedAt: winner.updatedAt, // Assuming your model has these

            // Add the decrypted/masked fields
            name: decryptedName, // This will be null if decryption failed or field was empty
            phone: maskedPhone,   // This will be null if decryption/masking failed or field was empty
            phoneNumberHash: winner.phoneNumberHash // Include the hash if useful for verification
        };

        console.log(`[GET /api/winner] Winner data prepared for response:`, responseWinner);
        return res.json({ success: true, winner: responseWinner });
    } catch (err) {
        console.error("[GET /api/winner] Error fetching winner:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// POST /api/winner - Trigger winner selection (no changes needed here for decryption/masking)
router.post("/", async (req, res) => {
    try {
        console.log(`[POST /api/winner] Starting winner selection for cycle: ${CURRENT_CYCLE}`);

        const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });
        console.log(`[POST /api/winner] Found ${entries.length} completed entries.`);

        const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
        console.log(`[POST /api/winner] Calculated total amount from entries: ${totalAmount}`);

        if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
            console.log(`[POST /api/winner] Threshold not yet met. Entries: ${entries.length}/${MAX_PARTICIPANTS}, Total Amount: ${totalAmount}/${MAX_PARTICIPANTS}`);
            return res.json({ success: false, message: "Threshold not yet met" });
        }

        const existingWinner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
        if (existingWinner) {
            console.log(`[POST /api/winner] Winner already selected for cycle ${CURRENT_CYCLE}.`);
            return res.json({ success: false, message: "Winner already selected" });
        }
        console.log(`[POST /api/winner] No existing winner found for cycle ${CURRENT_CYCLE}. Proceeding to select.`);

        const participantHashes = entries.map((entry, index) => {
            const hashInput = `${index}-${entry.phoneNumberHash}`;
            return crypto.createHash("sha256").update(hashInput).digest("hex");
        });

        const combinedHashes = participantHashes.map((hash) => {
            const combinedInput = PUBLIC_SEED + hash;
            return crypto.createHash("sha256").update(combinedInput).digest("hex");
        });

        const scores = combinedHashes.map((hash) => parseInt(hash.slice(0, 8), 16));

        const winnerIndex = scores.indexOf(Math.min(...scores));
        const winnerEntry = entries[winnerIndex];

        // 5. Save winner to DB (saving the original encrypted name/phone)
        const savedWinner = await WinnerModel.create({
            entryId: winnerEntry._id,
            name: winnerEntry.name, // This should be the encrypted name
            phone: winnerEntry.phone, // This should be the encrypted phone
            phoneNumberHash: winnerEntry.phoneNumberHash,
            amount: winnerEntry.amount,
            location: winnerEntry.location,
            cycle: CURRENT_CYCLE,
            transactionId: winnerEntry.transactionId,
            mpesaReceiptNumber: winnerEntry.mpesaReceiptNumber,
            publicRandomSeed: PUBLIC_SEED,
        });
        console.log(`[POST /api/winner] Winner saved to DB with ID: ${savedWinner._id}`);

        return res.json({ success: true, winner: savedWinner });
    } catch (err) {
        console.error("[POST /api/winner] Error selecting winner:", err);
        res.status(500).json({ success: false, error: "Failed to select winner" });
    }
});

export default router;