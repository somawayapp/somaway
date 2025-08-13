import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema(
  {
    entryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry", // Reference to the Entry model
      required: true,
      unique: true, // A single entry can only win once
    },
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
       default: "g6" // This will auto-assign "g1" unless overridden

    },
        total: {
       type: Number,
       required: true,
       default: "1000000" // This will auto-assign "g1" unless overridden

    },
    phoneNumberHash: {
      type: String,
      required: true,
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
    cycle: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
    mpesaReceiptNumber: {
      type: String,
    },
    winDate: {
      type: Date,
      default: Date.now,
    },
    // You might want to store the public random seed used for this draw
    publicRandomSeed: {
      type: String,
      required: true,
    },
    // Optionally, store the array of participant hashes for auditability
    // participantHashesAtDraw: {
    //   type: [String],
    //   required: true,
    // }
  },
  { timestamps: true }
);

const WinnerModel = mongoose.model("Winner6", WinnerSchema);

export default WinnerModel;