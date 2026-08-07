const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    validateUrl
} = require("../middlewares/validate.middleware");

const {
    createShortUrl,
    getAllUrls,
    deleteUrl,
    getUrlAnalytics
} = require("../controllers/url.controller");

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

// Delete URL
router.delete(
    "/:id",
    authMiddleware,
    deleteUrl
);

module.exports = router;