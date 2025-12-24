import {
  electionDet,
  getNames,
  getElection,
  getActiveNames,
  voteElection,
  handleVoters,
  getCount,
  contestingNames,
  votingNames,
  LiveResults,
} from "../Controllers/election.control.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/authMiddleware.js";
const router = Router();

router.route("/details").post(verifyJWT, electionDet);
router.route("/update").post(verifyJWT, getElection);
router.route("/names").get(verifyJWT, getNames);
router.route("/active-names").get(verifyJWT, getActiveNames);
router.route("/vote").post(verifyJWT, voteElection);
router.route("/ballot").post(verifyJWT, handleVoters);
router.route("/see").post(verifyJWT, getCount);
router.route("/vote-names").get(verifyJWT, votingNames);
router.route("/candidate-names").get(verifyJWT, contestingNames);
router.route("/live-results").post(LiveResults);

export default router;
