import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createComplaint,
  getMyComplaints,
} from "../controllers/complaintController.js";
import upload from "../utils/imageupload/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("photo"), createComplaint);

router.get("/my", protect, getMyComplaints);

export default router;