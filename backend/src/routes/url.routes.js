const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    createShortUrl,
    getAllUrls,
    deleteUrl,
    getUrlAnalytics
} = require("../controllers/url.controller");

router.post("/", authMiddleware, createShortUrl);

router.get("/", authMiddleware, getAllUrls);

router.get("/:id/analytics", authMiddleware, getUrlAnalytics);

router.delete("/:id", authMiddleware, deleteUrl);


module.exports = router;