require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

async function sendResetOtpEmail(to, otp) {
  const subject = "ThriveHer Password Reset OTP";
  const text = `Your password reset OTP is: ${otp}`;
  const html = `
    <p>You requested a password reset for your ThriveHer account.</p>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This code is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendMail(to, subject, text, html);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema with reset password OTP fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
  resetPasswordOtp: String,
  resetPasswordOtpExpires: Date,
  resetPasswordOtpVerified: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

const pendingSignups = {};

// JWT Middleware for protected routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Routes

// Test mail sending
app.post("/api/test-email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    await sendMail(to, subject, text, html);
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("/api/test-email error:", err);
    res.status(500).json({ message: "Failed to send email.", error: err.message });
  }
});

// Protected profile route
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ email: user.email, age: user.age });
  } catch (err) {
    console.error("/api/profile error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Signup - send OTP to email
app.post("/api/signup", async (req, res) => {
  const { name, email, password, age } = req.body;
  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    pendingSignups[email] = {
      name,
      email,
      password: hashedPassword,
      age,
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    };
    await sendMail(
      email,
      "Your ThriveHer Signup OTP",
      `Your OTP for ThriveHer signup is: ${otp}`,
      `<p>Your OTP for ThriveHer signup is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`
    );
    res.json({ message: "OTP sent to your email. Please verify to complete signup." });
  } catch (err) {
    console.error("/api/signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Verify signup OTP and create user
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const pending = pendingSignups[email];
  if (!pending) return res.status(400).json({ message: "No pending signup for this email." });
  if (pending.expires < Date.now()) {
    delete pendingSignups[email];
    return res.status(400).json({ message: "OTP expired. Please sign up again." });
  }
  if (pending.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

  try {
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      age: pending.age,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    delete pendingSignups[email];
    res.status(201).json({ token, user: { name: user.name, email: user.email, age: user.age } });
  } catch (err) {
    console.error("/api/verify-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required." });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token, user: { name: user.name, email: user.email, age: user.age } });
  } catch (err) {
    console.error("/api/login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * PASSWORD RESET BY OTP WORKFLOW
 */

// 1. Request OTP for password reset
app.post("/api/request-password-reset-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If that email is registered, reset instructions have been sent." });
    }
    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
    user.resetPasswordOtpVerified = false;
    await user.save();
    await sendResetOtpEmail(user.email, otp);

    res.json({ message: "If that email is registered, reset instructions have been sent." });
  } catch (err) {
    console.error("/api/request-password-reset-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// 2. Verify OTP for password reset
app.post("/api/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpires ||
      user.resetPasswordOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    if (user.resetPasswordOtp !== otp) return res.status(400).json({ message: "Incorrect OTP." });
    user.resetPasswordOtpVerified = true;
    await user.save();
    res.json({ message: "OTP verified. You may now reset your password." });
  } catch (err) {
    console.error("/api/verify-reset-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// 3. Actually reset the password after OTP is verified
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required." });

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetPasswordOtpExpires ||
      user.resetPasswordOtpExpires < Date.now() ||
      !user.resetPasswordOtpVerified
    ) {
      return res.status(400).json({ message: "OTP verification required or expired. Please restart reset process." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    user.resetPasswordOtpVerified = false;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("/api/reset-password error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
