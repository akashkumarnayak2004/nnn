// middleware/admin.middleware.js
import jwt from "jsonwebtoken";
import config from "../config.js";

export const adminMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_SECRET);

    // ✅ Block access if role is not admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.admin = { id: decoded.id }; // attach admin ID
    next();
  } catch (error) {
    console.error("Admin auth failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
