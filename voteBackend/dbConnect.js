import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`There is a error:${error}`);
    process.exit(1);
  }
};

export default connectDB;
