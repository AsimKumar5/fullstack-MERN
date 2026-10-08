import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  let decoded;
  try {
    const authorization = req.get("authorization");
    const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const token = bearerToken || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const user = await User.findById(decoded.id).select("name email isActive").lean();
    if (!user || user.isActive === false) {
      return res.status(401).json({ message: "User account is unavailable" });
    }

    req.user = { ...decoded, name: user.name, email: user.email };
    return next();
  } catch (error) {
    console.error("Unable to validate user session:", error);
    return res.status(500).json({ message: "Unable to validate user session" });
  }
};

export { userAuth };