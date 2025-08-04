import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
  cycle: {
    type: Number,
    required: true,
    unique: true, // Only one winner per cycle
  },
  winnerEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry', // Reference to the EntryModel
    required: true,
  },
  name: {
    type: String, // Encrypted winner name
    required: true,
  },
  phone: {
    type: String, // Encrypted winner phone
    required: true,
  },
  amountWon: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Data needed for auditable randomness
  publicRandomSeed: {
    type: String, // e.g., Bitcoin block hash
    required: true,
  },
  participantHashesSnapshot: {
    type: [String], // Array of participant hashes at the time of draw
    required: true,
  },
  winnerCalculatedIndex: {
    type: Number, // The index of the winner in the participantHashesSnapshot array
    required: true,
  },
});

const WinnerModel = mongoose.models.Winner || mongoose.model("Winner", WinnerSchema);
export default WinnerModel;