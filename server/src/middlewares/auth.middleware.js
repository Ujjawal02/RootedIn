const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.userVerification = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user; // this is what getMe, and every ownership check we wrote earlier, relies on
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};

module.exports.isFarmer = (req, res, next) => {
    if (req.user?.role !== "farmer") {
        return res.status(403).json({ success: false, message: "Farmer access required" });
    }
    next();
};