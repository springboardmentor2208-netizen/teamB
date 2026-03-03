import User from "../models/User.js";
import {
  uploadTOCloudinary,
  deleteFromCloudinary,
} from "../utils/imageupload/cloudinaryFileHandling.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.location = req.body.location || user.location;
  user.phone = req.body.phone || user.phone;

  if (req.file) {
    if (user.photoPublicId) {
      await deleteFromCloudinary(user.photoPublicId);
    }

    const result = await uploadTOCloudinary(
      req.file.buffer,
      "profiles"
    );

    user.profile_photo = result.secure_url;
    user.photoPublicId = result.public_id;
  }

  await user.save();

  res.json(user);
};