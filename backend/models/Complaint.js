import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Garbage", "Pothole", "Water Leakage", "Streetlight", "Other"],
      default: "Other",
    },
    photo: String,
    photoPublicId: String,
    location_coords: {
      lat: Number,
      lng: Number,
    },
    address: { type: String, required: true },
    assigned_to: String,
    status: {
      type: String,
      enum: ["received", "in_review", "in_progress", "resolved", "closed"],
      default: "received",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);