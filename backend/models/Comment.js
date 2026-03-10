import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  complaint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true
  },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
