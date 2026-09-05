const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const user = await User.create({ name, email, phone, password }); // role defaults to "user" — never trusted from the client

        return res.status(201).json({
            success: true,
            message: "Signup successful",
        });
    } catch (error) {
        console.log("Signup Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        user.password = undefined; // never send the hash back, even accidentally

        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: "Login successful",
                user,
            });
    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out" });
};

module.exports.getMe = async (req, res) => {
    // req.user is attached by the auth middleware (next step) — this route is protected
    return res.status(200).json({ success: true, user: req.user });
};