import {
  registerContestant,
  registerOrUpdateContestant,
  getAllContestants,
  getProfile,
  updatePost,
} from "../Controllers/contestant.control.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(verifyJWT, registerContestant);
router.route("/update-profile").post(verifyJWT, registerOrUpdateContestant);
router.route("/data").get(verifyJWT, getAllContestants);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/updPost").post(verifyJWT, updatePost);

export default router;
