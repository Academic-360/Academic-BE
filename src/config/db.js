import mongoose from "mongoose";

const connectDB = async () => {
  // Check if we have a connection to the database
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    // Throw an error instead of exiting the process, which is better for serverless environments
    throw new Error("Database connection failed.");
  }
};

export default connectDB;
