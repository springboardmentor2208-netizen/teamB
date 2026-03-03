import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../utils/imageupload/upload.js";

const router = express.Router();

router.get("/me", protect, getProfile);

router.put(
  "/me",
  protect,
  upload.single("profileImage"),
  updateProfile
);

export default router;