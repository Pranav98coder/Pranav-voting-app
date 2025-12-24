import {
  registerVoter,
  getData,
  handleVotes,
  userVoterProfile,
} from "../Controllers/voter.control.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/authMiddleware.js";
const router = Router();
router.route("/register").post(verifyJWT, registerVoter);
router.route("/data").get(verifyJWT, getData);
router.route("/submit").post(verifyJWT, handleVotes);
router.route("/profile").get(verifyJWT, userVoterProfile);

export default router;
