// --- utils/encryption.js ---
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET || "your-32-char-secret-key-123456";

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text) {
  const [ivHex, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


// --- models/Phone.model.js ---
import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  amount: Number,
  location: {
    country: String,
    city: String,
    region: String,
    timezone: String,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Phone", phoneSchema);

