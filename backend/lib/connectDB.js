import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://makesomaway:makesomaway@cluster0.movbe.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0";
    
    if (!uri) {
      throw new Error("DATABASE_URL is missing in environment variables.");
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

