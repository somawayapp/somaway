// models/Cycle.model.js
import mongoose from "mongoose";

const CycleSchema = new mongoose.Schema({
  number: { type: Number, default: 1 },
});

export default mongoose.model("Cycle", CycleSchema);
