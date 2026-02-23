import express from "express";
import { loginUser, registerUser, forgotPassword, verifyOTP, resetPassword, verifyRegistrationOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/verify-registration-otp", verifyRegistrationOTP);

export default router;
