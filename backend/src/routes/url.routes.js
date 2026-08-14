const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    validateUrl
} = require("../middlewares/validate.middleware");

const {
    apiLimiter
} = require("../middlewares/rateLimiter");

const {
    createShortUrl,
    getAllUrls,
    deleteUrl,
    getUrlAnalytics,
    generateUrlQRCode

} = require("../controllers/url.controller");

// Apply API rate limiter to all routes in this file
router.use(apiLimiter);

// Create Short URL
router.post(
    "/",
    authMiddleware,
    validateUrl,
    createShortUrl
);

// Get All URLs
router.get(
    "/",
    authMiddleware,
    getAllUrls
);

// Get Analytics
router.get(
    "/:id/analytics",
    authMiddleware,
    getUrlAnalytics
);

router.get(
    "/:id/qr",
    authMiddleware,
    generateUrlQRCode
);

// Delete URL
router.delete(
    "/:id",
    authMiddleware,
    deleteUrl
);

module.exports = router;