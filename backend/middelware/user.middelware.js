import jwt from "jsonwebtoken";
import config from "../config.js";

export const authMiddleware = (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
    
}