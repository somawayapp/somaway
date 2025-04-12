import mongoose from "mongoose";

// This function is used to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const uri =  "mongodb+srv://makesomaway:makesomaway@cluster0.movbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=app "; // Get the DB connection URI from environment variables
    if (!uri) {
      throw new Error("DATABASE_URL is missing in environment variables.");
    }
  
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: false, 
   
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit with failure if connection fails
  }
};

export default connectDB;

