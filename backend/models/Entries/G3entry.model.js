import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String, // Storing the encrypted phone number
      required: true,
    },
    groupId: {
      type: String,
      required: true,
       default: "g3" // This will auto-assign "g1" unless overridden

    },
        total: {
       type: Number,
       required: true,
       default: "1000" // This will auto-assign "g1" unless overridden

    },
    // ADD THIS NEW FIELD
    phoneNumberHash: {
      type: String,
      required: true,
      // You might want a compound index for (phoneNumberHash, cycle) if phone numbers should be unique per cycle
      // Example below will make phoneNumberHash unique globally, adjust as needed.
      // unique: true // Consider making this unique per cycle if you want same number in different cycles
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      country: { type: String, default: "Unknown" },
      city: { type: String, default: "Unknown" },
      region: { type: String, default: "Unknown" },
      timezone: { type: String, default: "Unknown" },
    },
     status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cancelled", "Query_Failed"], // <<<--- UPDATED ENUM
      required: true,
      default: "Pending",
    },
    failReason: {
      type: String, // To store ResultDesc from M-Pesa failures
    },
    cycle: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },


    mpesaReceiptNumber: {
      type: String,
      unique: true, // Store and ensure unique M-Pesa receipt numbers
      sparse: true, // Allows null values but enforces uniqueness for non-null values
    },

  },
  { timestamps: true }
);



// Optional: Add a compound unique index if a phone number should only appear once per cycle
// This is generally a good idea for "duplicate entry" prevention
EntrySchema.index({ phoneNumberHash: 1, cycle: 1 }, { unique: true });


const EntryModel = mongoose.model("Entry3", EntrySchema);

export default EntryModel;