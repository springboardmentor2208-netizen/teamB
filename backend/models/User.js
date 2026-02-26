import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    location: { type: String },
    role: {
      type: String,
      enum: ["user", "volunteer", "admin"],
      default: "user",
    },
    profile_photo: { type: String },
    photoPublicId: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
