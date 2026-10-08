import mongoose from "mongoose";

//mongodb connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/fullstack";
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to mongoDB:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;