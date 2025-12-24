import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./Middleware/authMiddleware.js";
import { errorHandler } from "./Middleware/errorHandling.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(verifyJWT);
//routes import
import userRouter from "./Routes/user.routes.js";
import voterRouter from "./Routes/voter.routes.js";
import contestantRouter from "./Routes/contestant.routes.js";
import electionRouter from "./Routes/election.routes.js";
import registerRouter from "./Routes/register.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/voter", voterRouter);
app.use("/api/v1/contestants", contestantRouter);
app.use("/api/v1/election", electionRouter);
app.use("/api/v1/send", registerRouter);

// http://localhost:8000/api/v1/users/register
app.use(errorHandler);

export { app };
