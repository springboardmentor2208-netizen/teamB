const express = require("express");
const Complaint = require("../models/Complaint");

const router = express.Router();

// Create complaint
router.post("/", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id assigned_to");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
