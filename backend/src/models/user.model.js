const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  role: {
    type: String,
    enum: ["user", "volunteer", "admin"],
    default: "user"
  },
  profile_photo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);