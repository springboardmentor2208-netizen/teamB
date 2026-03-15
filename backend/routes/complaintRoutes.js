import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createComplaint,
  getMyComplaints,
  getComplaintDetails,
  updateComplaintStatus,
  voteOnComplaint,
  getComplaintVotes,
  addCommentToComplaint,
  getComplaintComments,
  getAllComplaints
} from "../controllers/complaintController.js";
import upload from "../utils/imageupload/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("photo"), createComplaint);

router.get("/", protect, getAllComplaints);
router.get("/my", protect, getMyComplaints);

router.get("/:id", protect, getComplaintDetails);

router.patch("/:id/status", protect, updateComplaintStatus);

router.post("/:id/vote", protect, voteOnComplaint);
router.get("/:id/votes", protect, getComplaintVotes);

router.post("/:id/comments", protect, addCommentToComplaint);
router.get("/:id/comments", protect, getComplaintComments);

export default router;