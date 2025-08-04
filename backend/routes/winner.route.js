import crypto from "crypto";
import axios from "axios";
import moment from "moment"; // Required for generating timestamp for M-Pesa password
import EntryModel from "./Entry.model.js"; // Assuming EntryModel path relative to where this function would reside
import WinnerModel from "./Winner.model.js"; // Assuming WinnerModel path relative to where this function would reside

// --- Configuration Variables (These should ideally be loaded from environment or a config service) ---
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your_32_byte_hex_encryption_key'; // Fallback for demonstration
const IV_LENGTH = 16;
const shortCode = process.env.MPESA_SHORTCODE || 'your_mpesa_shortcode'; // Fallback for demonstration
const passkey = process.env.MPESA_PASSKEY || 'your_mpesa_passkey'; // Fallback for demonstration
const consumerKey = process.env.CONSUMER_KEY || 'your_consumer_key'; // For getAccessToken
const consumerSecret = process.env.CONSUMER_SECRET || 'your_consumer_secret'; // For getAccessToken

const MAX_PARTICIPANTS = 10; // For testing, set to a small number like 10, should be 1,000,000 in production
const PRIZE_AMOUNT = MAX_PARTICIPANTS; // 1 KES per participant, winner gets total amount
let CURRENT_CYCLE = 1; // This should ideally be managed dynamically from a DB or persistent config

// --- Helper Functions (Copied from your original code, necessary for winner selection logic) ---

// Helper Functions for Encryption & Decryption (needed for storing/retrieving winner's name/phone securely)
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  if (!text) return null;
  const textParts = text.split(":");
  if (textParts.length !== 2) {
    console.error("Invalid encrypted text format for decryption:", text);
    return null;
  }
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Get access token (required by queryStkStatus if it were to be used for final payment to winner)
// This particular function is not strictly needed *within* selectWinner itself for just picking a winner,
// but it's part of your overall system and might be used if `selectWinner` also triggers prize disbursement.
// Keeping it for completeness as it was in the original context.
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


// Get latest Bitcoin block hash from a reliable API
// This is the source of public, verifiable randomness.
async function getLatestBitcoinBlockHash() {
  try {
    // blockstream.info is a public and widely used API for Bitcoin block data
    const response = await axios.get("https://blockstream.info/api/blocks/tip/hash");
    return response.data; // This returns the hash directly
  } catch (error) {
    console.error("Failed to get latest Bitcoin block hash:", error.message);
    throw new Error("Failed to get public random seed (Bitcoin block hash). Winner selection aborted.");
  }
}

// --- WINNER SELECTION FUNCTION ---
/**
 * Selects a winner for a given cycle using a verifiable random process based on Bitcoin block hashes.
 * Stores the winner and audit data in the database.
 *
 * @param {number} cycle - The cycle number for which to select a winner.
 * @returns {Promise<{success: boolean, winner?: object, error?: string, message?: string}>}
 */
export async function selectWinner(cycle) {
  console.log(`Attempting to select winner for cycle: ${cycle}`);
  try {
    // 1. Check if a winner has already been selected for this cycle
    const existingWinner = await WinnerModel.findOne({ cycle: cycle });
    if (existingWinner) {
      console.log(`Winner already selected for cycle ${cycle}. Aborting.`);
      return {
        success: true,
        message: `Winner already selected for cycle ${cycle}.`,
        winner: {
          cycle: existingWinner.cycle,
          name: decrypt(existingWinner.name),
          phone: decrypt(existingWinner.phone),
          amountWon: existingWinner.amountWon,
          timestamp: existingWinner.timestamp,
        }
      };
    }

    // 2. Fetch all completed participants for the specified cycle
    const participants = await EntryModel.find({
      status: "Completed",
      cycle: cycle,
    }).select('phone phoneNumberHash name _id'); // Select only necessary fields and _id for uniqueness

    if (participants.length === 0) {
      console.warn(`No completed participants found for cycle ${cycle}. Cannot select winner.`);
      return { success: false, message: "No completed participants for this cycle." };
    }

    // 3. Get a public random seed (e.g., latest Bitcoin block hash)
    // This makes the process transparent and auditable.
    const publicRandomSeed = await getLatestBitcoinBlockHash();
    console.log(`Public Random Seed (Bitcoin Block Hash): ${publicRandomSeed}`);

    // 4. Build a list of cryptographically derived hashes for each participant
    // Using index, phoneHash, and _id makes each participant's derived hash unique and tied to their entry.
    const participantHashesForDraw = participants.map((entry, index) => {
      // It's crucial that this exact hashing method is used for auditability.
      return crypto.createHash("sha256").update(`${index}-${entry.phoneNumberHash}-${entry._id.toString()}`).digest("hex");
    });
    console.log(`Generated ${participantHashesForDraw.length} participant hashes for draw.`);

    // 5. Combine each participant's derived hash with the public seed and find the "smallest" score
    // The "smallest" score is determined by converting the first few characters of the combined hash to an integer.
    const combinedScores = participantHashesForDraw.map(h => {
      const combinedHash = crypto.createHash("sha256").update(publicRandomSeed + h).digest("hex");
      // Taking the first 8 hex characters provides 32 bits of randomness for the score.
      // This is a common method for deterministic selection from a random hash.
      return parseInt(combinedHash.slice(0, 8), 16);
    });
    console.log("Calculated combined scores.");

    const minScore = Math.min(...combinedScores);
    const winnerIndex = combinedScores.indexOf(minScore);
    const winnerEntry = participants[winnerIndex];

    console.log(`Winner found! Index: ${winnerIndex}, Entry ID: ${winnerEntry._id}`);

    // 6. Store winner information in the database, including all audit data
    const newWinner = new WinnerModel({
      cycle: cycle,
      winnerEntry: winnerEntry._id, // Reference to the original entry
      name: winnerEntry.name,       // Encrypted name
      phone: winnerEntry.phone,     // Encrypted phone
      amountWon: PRIZE_AMOUNT,      // The total prize amount for this cycle
      publicRandomSeed: publicRandomSeed, // The Bitcoin block hash used
      participantHashesSnapshot: participantHashesForDraw, // All participant hashes at the time of draw
      winnerCalculatedIndex: winnerIndex, // The index of the winner in the snapshot
    });
    await newWinner.save();
    console.log(`Winner for cycle ${cycle} saved to DB.`);

    // 7. (Optional but important): Increment the cycle counter for the next draw.
    // In a production app, this should update a persistent configuration.
    // For this isolated function, we'll just increment the local variable.
    // CURRENT_CYCLE++; // Remove this line if CURRENT_CYCLE is managed externally

    // Optionally, trigger payout or notification for the winner here.

    return {
      success: true,
      winner: {
        cycle: newWinner.cycle,
        name: decrypt(newWinner.name), // Decrypt for immediate display/use
        phone: decrypt(newWinner.phone), // Decrypt for immediate display/use
        amountWon: newWinner.amountWon,
        timestamp: newWinner.timestamp,
        publicRandomSeed: newWinner.publicRandomSeed,
        winnerCalculatedIndex: newWinner.winnerCalculatedIndex,
      },
      message: `Winner selected for cycle ${cycle}.`
    };

  } catch (error) {
    console.error(`Error selecting winner for cycle ${cycle}:`, error);
    return { success: false, error: `Failed to select winner: ${error.message}` };
  }
}

// Example usage (for testing this isolated function)
// You would call selectWinner(CURRENT_CYCLE) when your criteria are met.
/*
// Make sure to set up your environment variables before running this directly
// process.env.NODE_ENV = 'development'; // Or 'production'
// require('dotenv').config(); // If you need dotenv
// mongoose.connect(process.env.MONGODB_URI); // Connect to your database
// Call this function when the cycle threshold is reached
// selectWinner(1).then(result => console.log(result)).catch(console.error);
*/
