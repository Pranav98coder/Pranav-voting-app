import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();

import connectDB from "./dbConnect.js";

const port = process.env.PORT;
connectDB();
mongoose.set("strictPopulate", false);
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
app.get("/api", (req, res) => {
  res.send("PranavSilla");
});

{
  /*voter updation*/
}
// const User = require("./Models/user.js");

// // Assume 'authenticateToken' middleware is used to put the user ID into req.user.id
// app.put("/api/profile-update", authenticateToken, async (req, res) => {
//   // The user's unique MongoDB ID is available here from the token payload:
//   const userId = req.user.id;

//   // Data submitted from the client form:
//   const profileUpdates = req.body;
//   // e.g., { name: "John Doe", rollno: "V001", age: 25, course: "CS" }

//   try {
//     // Use Mongoose to find the exact document using its _id and merge the new data
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: profileUpdates }, // $set ensures new fields are added or existing ones updated
//       { new: true, runValidators: true } // 'new: true' returns the updated document
//     );

//     if (!updatedUser) {
//       return res.status(404).send("User not found.");
//     }

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });
