export const getProfile = async (req, res) => {
  res.json(req.user);
};
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(updated);
};
