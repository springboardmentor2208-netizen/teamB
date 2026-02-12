const User = require("../models/user.model");
const asyncHandler = require("../middleware/asyncHandler");
const sendSuccess = require("../utils/response");
const ApiError = require("../utils/apiError");

//user register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location, role, profile_photo } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name,email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const newUser = await User.create({ name, email, password, location, role, profile_photo });

  return sendSuccess(res, 201, "User registered successfully", newUser);
});



//user login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.password !== password) {
    throw new ApiError(400, "Invalid password");
  }

  return sendSuccess(res, 200, "Login successful", user);
});


//gettin user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendSuccess(res, 200, "User fetched", user);
});


//user update
const userUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userUpdate = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!userUpdate) {
    throw new ApiError(404, "User not found");
  }

  return sendSuccess(res, 200, "User fetched for update", userUpdate);
});

module.exports = { registerUser, userLogin, getUserById, userUpdate };