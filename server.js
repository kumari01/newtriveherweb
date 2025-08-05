require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const app = express();

// --- Environment Variables ---
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Set your frontend origin here
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "thriveher_token";

// --- Middleware ---
app.use(express.json());

// CORS configured with allowed origin
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
}));



// Optional: Force HTTPS middleware for production (uncomment to use)
// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === "production" && !req.secure) {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

// --- Nodemailer setup ---
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

// --- Utility ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validatePassword(password) {
  // Minimum 6 chars, at least one uppercase, one lowercase, one number (basic example)
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return re.test(password);
}

// --- MongoDB Connection ---

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- User Schema ---

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  age: { type: String, required: true },

  // Signup OTP fields
  signupOtp: String,
  signupOtpExpires: Date,
  signupOtpAttempts: { type: Number, default: 0 },

  // Password reset OTP fields
  resetPasswordOtp: String,
  resetPasswordOtpExpires: Date,
  resetPasswordOtpVerified: { type: Boolean, default: false },
  resetPasswordOtpAttempts: { type: Number, default: 0 },

  // Login attempts for account lockout
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

}, { timestamps: true });

const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours lock

userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

const User = mongoose.model("User", userSchema);

// --- Rate Limiting ---

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after 10 minutes",
  },
});

app.use("/api/signup", authLimiter);
app.use("/api/login", authLimiter);
app.use("/api/request-password-reset-otp", authLimiter);

// --- JWT Cookie Helpers ---

function issueJwtCookie(res, token) {
  const secureFlag = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    path: "/",
  });
}

// --- Auth Middleware ---

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// --- Routes ---

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
    const user = await User.findById(req.user.userId).select("email age");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("/api/profile error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Signup: create new user with OTP - persist OTP in DB
app.post("/api/signup", async (req, res) => {
  let { name, email, password, age } = req.body;

  if (!name || !email || !password || !age)
    return res.status(400).json({ message: "All fields are required." });

  // Normalize email
  email = email.toLowerCase().trim();

  if (!validatePassword(password))
    return res.status(400).json({
      message:
        "Password must be at least 6 characters, include uppercase, lowercase letters, and a number.",
    });

  try {
    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      if (user.signupOtp && user.signupOtpExpires > Date.now()) {
        return res.status(429).json({ message: "Signup OTP already sent. Please check your email." });
      }
      return res.status(409).json({ message: "User already exists." });
    }

    // Create user with hashed password and OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      signupOtp: otp,
      signupOtpExpires: otpExpires,
      signupOtpAttempts: 0,
    });

    await user.save();

    // Send OTP email
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

// Verify signup OTP and activate user
app.post("/api/verify-otp", async (req, res) => {
  let { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  email = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email });
    if (!user || !user.signupOtp || !user.signupOtpExpires)
      return res.status(400).json({ message: "No pending signup for this email." });

    // Check for expiration
    if (user.signupOtpExpires < Date.now()) {
      user.signupOtp = undefined;
      user.signupOtpExpires = undefined;
      user.signupOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please sign up again." });
    }

    // Limit OTP attempts and lock after too many tries
    user.signupOtpAttempts = (user.signupOtpAttempts || 0) + 1;
    if (user.signupOtpAttempts > 5) {
      user.signupOtp = undefined;
      user.signupOtpExpires = undefined;
      user.signupOtpAttempts = 0;
      await user.save();
      return res.status(429).json({ message: "Too many incorrect OTP attempts. Please sign up again." });
    }

    if (user.signupOtp !== otp) {
      await user.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP correct - finalize signup
    user.signupOtp = undefined;
    user.signupOtpExpires = undefined;
    user.signupOtpAttempts = 0;
    await user.save();

    // Issue JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });

    // Send token in HTTP-only cookie
    issueJwtCookie(res, token);

    res.status(201).json({ token, user: { name: user.name, email: user.email, age: user.age } });
  } catch (err) {
    console.error("/api/verify-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required." });

  email = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    if (user.isLocked()) {
      return res.status(423).json({ message: "Account locked due to multiple failed login attempts. Try later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
    issueJwtCookie(res, token);

    res.json({ token, user: { name: user.name, email: user.email, age: user.age } });
  } catch (err) {
    console.error("/api/login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Request OTP for password reset
app.post("/api/request-password-reset-otp", async (req, res) => {
  let { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  email = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Respond generically to prevent email enumeration
      return res.json({ message: "If that email is registered, reset instructions have been sent." });
    }

    // Generate OTP and reset attempt count
    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
    user.resetPasswordOtpVerified = false;
    user.resetPasswordOtpAttempts = 0;
    await user.save();

    await sendResetOtpEmail(user.email, otp);

    res.json({ message: "If that email is registered, reset instructions have been sent." });
  } catch (err) {
    console.error("/api/request-password-reset-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Verify OTP for password reset
app.post("/api/verify-reset-otp", async (req, res) => {
  let { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  email = email.toLowerCase().trim();

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

    user.resetPasswordOtpAttempts = (user.resetPasswordOtpAttempts || 0) + 1;
    if (user.resetPasswordOtpAttempts > 5) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      user.resetPasswordOtpVerified = false;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return res.status(429).json({ message: "Too many incorrect OTP attempts. Please restart reset process." });
    }

    if (user.resetPasswordOtp !== otp) {
      await user.save();
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    user.resetPasswordOtpVerified = true;
    await user.save();

    res.json({ message: "OTP verified. You may now reset your password." });
  } catch (err) {
    console.error("/api/verify-reset-otp error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Reset password after OTP verification
app.post("/api/reset-password", async (req, res) => {
  let { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required." });

  email = email.toLowerCase().trim();

  if (!validatePassword(newPassword))
    return res.status(400).json({
      message:
        "Password must be at least 6 characters, include uppercase, lowercase letters, and a number.",
    });

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
    user.resetPasswordOtpAttempts = 0;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("/api/reset-password error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
