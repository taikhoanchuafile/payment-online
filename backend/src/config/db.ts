import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL!);
    console.log("Kết nối CSDL thành công!");
  } catch (error) {
    console.error("Kết nối CSDL thất bại!", error);
    process.exit(1);
  }
};

export default connectDB;
