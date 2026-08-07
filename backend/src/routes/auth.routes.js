const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    validateRegister,
    validateLogin
} = require("../middlewares/validate.middleware");

const {
    loginLimiter,
    registerLimiter
} = require("../middlewares/rateLimiter");

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} = require("../controllers/auth.controller");

// Register
router.post(
    "/register",
    registerLimiter,
    validateRegister,
    registerUser
);

// Login
router.post(
    "/login",
    (req, res, next) => {
        console.log("IP:", req.ip);
        next();
    },
    loginLimiter,
    validateLogin,
    loginUser
);

// Logout
router.post(
    "/logout",
    authMiddleware,
    logoutUser
);

// Current User
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

module.exports = router;