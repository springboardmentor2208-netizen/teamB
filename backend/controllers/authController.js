import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

/**
 * @desc    Register new user - send OTP
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, location, role, phone, username } = req.body;

  // 1️⃣ Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 2️⃣ Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // 3️⃣ Store registration data temporarily (in a temp user or use fields)
  // For simplicity, create a temp user with verified: false
  const tempUser = new User({
    name,
    email,
    username,
    phone,
    location,
    role,
    password: await bcrypt.hash(password, 10), // hash password
    resetToken: otp,
    resetTokenExpiry: otpExpiry,
  });
  await tempUser.save();

  // 4️⃣ Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is: ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email for verification" });
  } catch (error) {
    console.error(error);
    // Remove temp user if email fails
    await User.findByIdAndDelete(tempUser._id);
    res.status(500).json({ message: "Failed to send email" });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
    },
    token,
  });
};

/**
 * @desc    Forgot password - send OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to user
  user.resetToken = otp;
  user.resetTokenExpiry = otpExpiry;
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.resetToken !== otp || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.resetToken !== otp || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
};

/**
 * @desc    Verify registration OTP and complete registration
 * @route   POST /api/auth/verify-registration-otp
 * @access  Public
 */
export const verifyRegistrationOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.resetToken !== otp || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Clear OTP fields (user is now verified)
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified successfully. You can now login." });
};
