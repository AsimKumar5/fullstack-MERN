import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";

//<--------------------register User-------------------->
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(422).json({
        message: "fill all details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({
        message: "Email already registered",
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        message: "password and confirmPassword are not same",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//<--------------------login User-------------------->
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "fill all required details",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Wrong Email",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "This account has been deactivated. Contact the administrator.",
      });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }

    const tokenLifetime = rememberMe === true ? "30d" : "1d";
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: tokenLifetime },
    );
    const cookieOptions = { httpOnly: true };

    if (rememberMe === true) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    return res.status(200).cookie("token", token, cookieOptions).json({
      message: "Login Successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.email.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase(),
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Incorrect details",
      error: err.message,
    });
  }
};

const logoutUser = (req, res) => {
  return res.clearCookie("token").status(200).json({
    message: "Logout successful",
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email isActive");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(401).json({ message: "User account is unavailable" });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.email.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase(),
      },
    });
  } catch (err) {
    console.error("Unable to load user profile:", err);
    return res.status(500).json({ message: "Unable to load user profile" });
  }
};

const requestPasswordReset = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(503).json({
      message: "Password reset delivery is not configured",
    });
  }

  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ message: "Please enter a valid email address" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If an account exists for that email, a reset link is available.",
      });
    }

    const resetToken = randomBytes(32).toString("hex");
    user.passwordResetToken = createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    return res.status(200).json({
      message: "If an account exists for that email, a reset link is available.",
      resetUrl,
    });
  } catch (err) {
    console.error("Password reset request failed:", err);
    return res.status(500).json({ message: "Unable to create a password reset link" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body ?? {};
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({ message: "This password reset link is invalid or expired" });
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 128) {
    return res.status(422).json({ message: "Password must be between 6 and 128 characters" });
  }

  try {
    const passwordResetToken = createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "This password reset link is invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully. Please log in." });
  } catch (err) {
    console.error("Password reset failed:", err);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};

const getDashboard = (req, res) => {
  return res.status(200).json({
    marketData: [
      { name: "NIFTY 50", value: 22405, change: 0.84 },
      { name: "SENSEX", value: 73738, change: 0.72 },
      { name: "BANK NIFTY", value: 47825, change: -0.31 },
    ],
    topStocks: [
      {
        name: "Tata Consultancy Services",
        symbol: "TCS",
        price: 3820,
        change: 2.45,
      },
      { name: "Infosys", symbol: "INFY", price: 1650, change: 1.82 },
      {
        name: "Reliance Industries",
        symbol: "RELIANCE",
        price: 1450,
        change: -0.75,
      },
    ],
    recentTransactions: [],
    chartData: [
      { day: "Mon", value: 105000 },
      { day: "Tue", value: 108000 },
      { day: "Wed", value: 107500 },
      { day: "Thu", value: 112000 },
      { day: "Fri", value: 115000 },
      { day: "Sat", value: 113500 },
      { day: "Sun", value: 125450 },
    ],
  });
};



export {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getCurrentUser,
  getDashboard,
};
