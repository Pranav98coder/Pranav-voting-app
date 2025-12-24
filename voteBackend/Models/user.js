import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { VoterProfile } from "./voter.js";
import jwt from "jsonwebtoken";
import { ContestantProfile } from "./contestant.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true, // Ensures every username in the database is unique
    trim: true,

    minlength: 3,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6, // Enforce a minimum password length
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "contestant", "voter"], // Restricts value to one of these three strings
    default: "voter",
  },
  voterProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VoterProfile",
    default: null,
  },
  ContestantProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContestantProfile",
    default: null,
  },

  refreshToken: {
    type: String,
    default: null,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose "pre-save" hook (middleware) to hash the password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// userSchema.pre("save", async function (next) {
//   Only hash the password if it has been modified (or is new)
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     Generate a salt with 10 rounds
//     const salt = await bcrypt.genSalt(10);
//     Hash the password using the generated salt
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(); // Pass error to Mongoose
//   }
// });

// Optional: Add a method to the user schema to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
