const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    validateRegister,
    validateLogin
} = require("../middlewares/validate.middleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} = require("../controllers/auth.controller");

// Register
router.post(
    "/register",
    validateRegister,
    registerUser
);

// Login
router.post(
    "/login",
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