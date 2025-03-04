import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

export default router;
