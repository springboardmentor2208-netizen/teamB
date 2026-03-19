import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import AdminLog from "../models/AdminLog.js";

const router = express.Router();

// Get all users
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all complaints
router.get("/complaints", protect, authorizeRoles("admin"), async (req, res) => {
  const complaints = await Complaint.find().populate("user_id", "name email");
  res.json(complaints);
});

// Delete complaint
router.delete(
  "/complaint/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();

    await AdminLog.create({
      user_id: req.user._id,
      action: `Deleted complaint ${req.params.id}`,
      target: "Complaint",
      target_id: req.params.id,
    });

    res.json({ message: "Complaint deleted" });
  }
);

export default router;