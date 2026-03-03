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
      enum: ["received", "in_review", "resolved"],
      default: "received",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);