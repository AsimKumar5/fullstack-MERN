import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/fullstack");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to mongoDB:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;