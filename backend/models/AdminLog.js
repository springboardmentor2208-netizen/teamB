import mongoose from "mongoose";

const AdminLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  target: String,
  target_id: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

export default mongoose.model("AdminLog", AdminLogSchema);