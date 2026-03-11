import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
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
  vote_type: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true
  }
}, { timestamps: true });

// Ensure a user can only vote once per complaint
VoteSchema.index({ user_id: 1, complaint_id: 1 }, { unique: true });

export default mongoose.model("Vote", VoteSchema);
