import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createComplaint } from "../controllers/complaintController.js";
import upload from "../utils/imageupload/upload.js";

const router = express.Router();

// Create complaint
router.post("/", protect, upload.single("photo"), createComplaint);

export default router;
