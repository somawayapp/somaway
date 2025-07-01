// models/Entry.model.js
import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true, // Ensure phone numbers are unique
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      country: String,
      city: String,
      region: String,
      timezone: String,
    },
    mpesaReceiptNumber: {
      type: String,
      unique: true, // Store and ensure unique M-Pesa receipt numbers
      sparse: true, // Allows null values but enforces uniqueness for non-null values
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String, // Store the CheckoutRequestID from Safaricom
      unique: true,
      sparse: true,
    },
    // Add a field to track the cycle number if you plan to have multiple cycles
    cycle: {
      type: Number,
      default: 1, // Start with cycle 1
    },
  },
  { timestamps: true }
);

// Index for faster lookups on phone and transactionId
EntrySchema.index({ phone: 1 });
EntrySchema.index({ transactionId: 1 });

const Entry = mongoose.model("Entry", EntrySchema);

export default Entry;
