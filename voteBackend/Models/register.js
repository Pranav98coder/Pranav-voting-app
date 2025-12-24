import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  electionName: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
    enum: [
      "President",
      "Vice President",
      "Sports Secretary",
      "Cultural Secretary",
    ],
  },
  message: {
    type: String,
    default: "No message left",
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});
export const Register = mongoose.model("Register", registerSchema);
