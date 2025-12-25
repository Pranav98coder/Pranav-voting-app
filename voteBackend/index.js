import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();

import connectDB from "./dbConnect.js";

const port = process.env.PORT;
connectDB();
mongoose.set("strictPopulate", false);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, () => {
//   console.log(`app listening on port ${port}`);
// });
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully!");
});
app.get("/health", (req, res) => {
  res.send("PranavSilla");
});
