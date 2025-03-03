import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signupUser);

router.get("/login", loginUser);

router.get("/logout", logoutUser);

export default router;
