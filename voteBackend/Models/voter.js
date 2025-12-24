import mongoose from "mongoose";
const vectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    enum: [
      "Btech 1st year",
      "Btech 2nd year",
      "Btech 3rd year",
      "Btech 4th year",
      "Mtech 1st year",
      "Mtech 2nd year",
    ],
  },
  branch: {
    type: String,
    required: true,
    enum: [
      "Computer Science Engineering",
      "Electronics and Communication Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Biotechnology Engineering",
    ],
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContestantProfile",
    default: null,
  },
  canVote: {
    type: Boolean,
    default: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});
export const VoterProfile = mongoose.model("VoterProfile", vectorSchema);
