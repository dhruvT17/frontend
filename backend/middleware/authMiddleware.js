// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const verifyToken = (req, res, next) => {
//     const authHeader = req.header("Authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Access Denied. No token provided." });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. Invalid token format." });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);  // Ensure this key matches the login token generation
//         req.user = verified;
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: "Invalid token" });
//     }
// };

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== "Admin") {
//         return res.status(403).json({ message: "Access Denied. Admins only!" });
//     }
//     next();
// };

// module.exports = { verifyToken, isAdmin };


const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader);  // ✅ Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);  // ✅ Debugging

    if (!token) {
        return res.status(401).json({ message: "Access Denied. Invalid token format." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified Successfully:", verified);  // ✅ Debugging
        req.user = verified;
        next();
    } catch (err) {
        console.log("Token Verification Error:", err.message);  // ✅ Debugging
        return res.status(403).json({ message: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access Denied. Admins only!" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
