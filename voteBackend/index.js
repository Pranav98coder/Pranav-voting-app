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
