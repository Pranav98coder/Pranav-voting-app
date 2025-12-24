import {
  reg,
  show,
  deleteNotification,
} from "../Controllers/registration.control.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(verifyJWT, reg);
router.route("/recieve").get(verifyJWT, show);
router.route("/delete").post(verifyJWT, deleteNotification);

export default router;
