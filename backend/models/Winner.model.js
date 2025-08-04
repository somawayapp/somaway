// models/Winner.model.js
import mongoose from 'mongoose';

const WinnerSchema = new mongoose.Schema({
  cycle: {
    type: Number,
    required: true,
    unique: true, // Only one winner per cycle
  },
  winnerEntryId: { // Reference to the EntryModel document
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
    required: true,
  },
  winnerNameEncrypted: {
    type: String,
    required: true,
  },
  winnerPhoneEncrypted: {
    type: String,
    required: true,
  },
  amountWon: {
    type: Number,
    required: true,
  },
  selectionTimestamp: {
    type: Date,
    default: Date.now,
  },
  publicRandomSeed: { // The Bitcoin block hash used for this selection
    type: String,
    required: true,
  },
  // Store the state of participants at the time of selection for auditability
  // This could be an array of objects: [{ _id, phoneHash, originalIndex }]
  participantsSnapshot: {
    type: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        phoneHash: String,
        createdAt: Date, // To ensure order for deterministic selection
      }
    ],
    required: true,
  },
  // You might want to store the winning hash/score for audit
  winningHash: {
    type: String,
    required: true,
  },
  winningScore: {
    type: Number,
    required: true,
  },
});

const WinnerModel = mongoose.models.Winner || mongoose.model('Winner', WinnerSchema);
export default WinnerModel;