import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 2;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // Fixed, auditable

// IMPORTANT: In a real application, ENCRYPTION_KEY should be loaded securely
// from environment variables or a key management system, NOT hardcoded.
// This is for conceptual demonstration ONLY.
const ENCRYPTION_KEY = "YOUR_SECURE_32_BYTE_HEX_ENCRYPTION_KEY"; // Placeholder - REPLACE THIS!
const IV_LENGTH = 16; // For AES-256-CBC

// Helper Functions for Encryption (from your provided code)
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
    if (!text) return null; // Handle cases where text might be null/undefined
    try {
        const textParts = text.split(":");
        if (textParts.length !== 2) {
            console.warn("Invalid encrypted text format for decryption:", text);
            return null;
        }
        const iv = Buffer.from(textParts[0], "hex");
        const encryptedText = Buffer.from(textParts[1], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Error during decryption:", error);
        return null;
    }
}

// Function to mask phone number (e.g., +2547XXXXXXXX to +2547***XX)
function maskPhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber.length < 7) { // Ensure sufficient length to mask
        return phoneNumber;
    }
    // Example masking: +254700123456 -> +254700***456
    // This assumes a typical Kenyan mobile number format. Adjust as needed.
    const start = phoneNumber.substring(0, phoneNumber.length - 5); // Keep first part (e.g., +25470)
    const end = phoneNumber.substring(phoneNumber.length - 2); // Keep last 2 digits (e.g., 56)
    const masked = "***"; // Masking characters
    return `${start}${masked}${end}`;
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

        // Conceptual Decryption and Masking (DO NOT USE WITH REAL SENSITIVE DATA WITHOUT PROPER SECURITY REVIEW)
        let decryptedName = null;
        let maskedPhone = null;

        if (winner.name) {
            decryptedName = decrypt(winner.name);
        }
        if (winner.phone) {
            const decryptedPhone = decrypt(winner.phone);
            if (decryptedPhone) {
                maskedPhone = maskPhoneNumber(decryptedPhone);
            }
        }

        const responseWinner = {
            ...winner.toObject(), // Convert Mongoose document to plain JavaScript object
            name: decryptedName, // Include decrypted name
            phone: maskedPhone, // Include masked phone number
            // Ensure you don't send the raw encrypted fields if not needed elsewhere
            // Or selectively remove them if they are part of winner.toObject()
        };
        // Example of removing original encrypted fields if they are still present
        delete responseWinner.name; // Remove the original encrypted name if it was there
        delete responseWinner.phone; // Remove the original encrypted phone if it was there


        console.log(`[GET /api/winner] Winner found for cycle ${CURRENT_CYCLE}:`, responseWinner);
        return res.json({ success: true, winner: responseWinner });
    } catch (err) {
        console.error("[GET /api/winner] Error fetching winner:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// POST /api/winner - Trigger winner selection (no changes here related to decryption/masking)
router.post("/", async (req, res) => {
    try {
        console.log(`[POST /api/winner] Starting winner selection for cycle: ${CURRENT_CYCLE}`);

        // 1. Fetch all completed entries for current cycle
        const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });
        console.log(`[POST /api/winner] Found ${entries.length} completed entries.`);
        // Log details of fetched entries for verification
        entries.forEach((entry, index) => {
            console.log(`  Entry ${index + 1}: _id=${entry._id}, amount=${entry.amount}, status=${entry.status}, cycle=${entry.cycle}`);
        });

        const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
        console.log(`[POST /api/winner] Calculated total amount from entries: ${totalAmount}`);
        console.log(`[POST /api/winner] MAX_PARTICIPANTS set to: ${MAX_PARTICIPANTS}`);

        if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
            console.log(`[POST /api/winner] Threshold not yet met. Entries: ${entries.length}/${MAX_PARTICIPANTS}, Total Amount: ${totalAmount}/${MAX_PARTICIPANTS}`);
            return res.json({ success: false, message: "Threshold not yet met" });
        }

        // 2. Check if winner already selected
        const existingWinner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
        if (existingWinner) {
            console.log(`[POST /api/winner] Winner already selected for cycle ${CURRENT_CYCLE}. Existing winner ID: ${existingWinner._id}`);
            return res.json({ success: false, message: "Winner already selected" });
        }
        console.log(`[POST /api/winner] No existing winner found for cycle ${CURRENT_CYCLE}. Proceeding to select.`);

        // 3. Hash participants
        const participantHashes = entries.map((entry, index) => {
            const hashInput = `${index}-${entry.phoneNumberHash}`;
            const hashOutput = crypto.createHash("sha256").update(hashInput).digest("hex");
            console.log(`[POST /api/winner] Participant ${index} hash input: "${hashInput}", output: "${hashOutput}"`);
            return hashOutput;
        });
        console.log("[POST /api/winner] All participant hashes generated.");

        // 4. Combine with seed and compute scores
        const combinedHashes = participantHashes.map((hash) => {
            const combinedInput = PUBLIC_SEED + hash;
            const combinedOutput = crypto.createHash("sha256").update(combinedInput).digest("hex");
            console.log(`[POST /api/winner] Combined hash input (PUBLIC_SEED + participant hash): "${combinedInput.substring(0, 50)}...", output: "${combinedOutput}"`); // Truncate long input for logging
            return combinedOutput;
        });
        console.log("[POST /api/winner] All combined hashes generated.");


        const scores = combinedHashes.map((hash) => {
            const score = parseInt(hash.slice(0, 8), 16);
            console.log(`[POST /api/winner] Hash for score: ${hash.slice(0, 8)}, Parsed score: ${score}`);
            return score;
        });
        console.log("[POST /api/winner] All scores computed:", scores);

        const winnerIndex = scores.indexOf(Math.min(...scores));
        console.log(`[POST /api/winner] Minimum score found: ${Math.min(...scores)} at index: ${winnerIndex}`);
        const winnerEntry = entries[winnerIndex];
        console.log("[POST /api/winner] Selected winner entry:", winnerEntry);


        // 5. Save winner to DB
        const savedWinner = await WinnerModel.create({
            entryId: winnerEntry._id,
            name: winnerEntry.name, // This would be the encrypted name
            phone: winnerEntry.phone, // This would be the encrypted phone
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