import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load env variables

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI not found in .env file");
    }


    await mongoose.connect(uri, {
      ssl: true,
      tlsAllowInvalidCertificates: false, 
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

