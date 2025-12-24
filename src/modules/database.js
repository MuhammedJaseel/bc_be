import mongoose from "mongoose";
import { MONGO_URI_DEV } from "./static.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI_DEV);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};
