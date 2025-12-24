import mongoose from "mongoose";

const contestantProfileSchema = new mongoose.Schema({
  // Link to the main User document using its unique _id

  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  post: {
    // From your first <select>
    type: String,
    required: true,
    enum: [
      "President",
      "Vice President",
      "Sports Secretary",
      "Cultural Secretary",
    ],
  },
  year: {
    // From your second <select>
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
    // From the Section <input>
    type: String,
    required: true,
    trim: true,
  },
  rollno: {
    // From the Roll no <input>
    type: String,
    required: true,
    unique: true,
  },
  votesCount: {
    // Added for the voting logic later
    type: Number,
    default: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

export const ContestantProfile = mongoose.model(
  "ContestantProfile",
  contestantProfileSchema
);
