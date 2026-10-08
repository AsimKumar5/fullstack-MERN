import User from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!configuredEmail) {
    return res.status(503).json({ message: "Admin access is not configured" });
  }

  try {
    const user = await User.findById(req.user.id).select("email isActive").lean();

    if (!user || user.isActive === false) {
      return res.status(401).json({ message: "User account is unavailable" });
    }

    if (user.email.trim().toLowerCase() !== configuredEmail) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.adminId = user._id.toString();
    req.adminEmail = configuredEmail;
    return next();
  } catch (error) {
    console.error("Unable to verify administrator access:", error);
    return res.status(500).json({ message: "Unable to verify administrator access" });
  }
};

export { adminAuth };
