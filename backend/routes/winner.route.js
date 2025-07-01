import crypto from "crypto";

// Step 1: Get public randomness (e.g., latest Bitcoin block hash)
const publicRandomSeed = "0000000000000000001a7c2139b7b72e..." // 64-char hex string

// Step 2: Build a list of hashes from your participants
const participantHashes = participants.map((entry, index) => {
  return crypto.createHash("sha256").update(`${index}-${entry.phoneHash}`).digest("hex");
});

// Step 3: Combine with public seed to find winner
const combinedHashes = participantHashes.map(h => 
  crypto.createHash("sha256").update(publicRandomSeed + h).digest("hex")
);

// Step 4: Convert each to number and find smallest
const scores = combinedHashes.map(h => parseInt(h.slice(0, 8), 16)); // 32-bit number
const winnerIndex = scores.indexOf(Math.min(...scores));
const winner = participants[winnerIndex];
