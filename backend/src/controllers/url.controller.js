const { redisClient } = require("../config/redis");
const Url = require("../models/url.model");
const { nanoid } = require("nanoid");
const generateQRCode = require("../utils/qrCode");

const createShortUrl = async (req, res) => {
    try {
        const { originalUrl, customCode } = req.body;

        // 1. Validate original URL
        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "Original URL is required"
            });
        }

        try {
            new URL(originalUrl);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }

        // 2. Check whether this URL already exists for this user
        const existingUrl = await Url.findOne({
            originalUrl,
            user: req.user.id
        });

        if (existingUrl) {
            const shortUrl =
                `${process.env.BASE_URL}/${existingUrl.shortCode}`;

            const qrCode = await generateQRCode(shortUrl);

            return res.status(200).json({
                success: true,
                message: "Short URL already exists",
                data: {
                    originalUrl: existingUrl.originalUrl,
                    shortCode: existingUrl.shortCode,
                    shortUrl,
                    qrCode
                }
            });
        }

        // 3. Generate or use custom short code
        let shortCode;

        if (customCode) {

            // Only allow letters, numbers, - and _
            if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Custom code can only contain letters, numbers, hyphens and underscores"
                });
            }

            // Length validation
            if (customCode.length < 3 || customCode.length > 30) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Custom code must be between 3 and 30 characters"
                });
            }

            shortCode = customCode;

        } else {

            // Automatically generate short code
            shortCode = nanoid(7);
        }

        // 4. Check whether short code already exists
        const existingShortCode = await Url.findOne({
            shortCode
        });

        if (existingShortCode) {
            return res.status(409).json({
                success: false,
                message: "Short code already exists"
            });
        }

        // 5. Save URL
        const url = await Url.create({
            originalUrl,
            shortCode,
            user: req.user.id
        });

        // 6. Create short URL
        const shortUrl =
            `${process.env.BASE_URL}/${url.shortCode}`;

        // 7. Generate QR Code
        const qrCode =
            await generateQRCode(shortUrl);

        // 8. Response
        return res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl,
                qrCode
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
const redirectToOriginalUrl = async (req, res, next) => {

    try {

        const { shortCode } = req.params;

        // 1. Check Redis Cache
        const cachedUrl = await redisClient.get(shortCode);

        if (cachedUrl) {

            console.log("✅ Cache Hit");

            await Url.findOneAndUpdate(
                { shortCode },
                { $inc: { clicks: 1 } }
            );

            return res.redirect(cachedUrl);

        }

        console.log("❌ Cache Miss");

        // 2. Fetch from MongoDB
        const url = await Url.findOne({ shortCode });

        if (!url) {

            return res.status(404).json({
                success: false,
                message: "Short URL not found"
            });

        }

        // 3. Store in Redis
        await redisClient.set(
            shortCode,
            url.originalUrl,
            {
                EX: 3600
            }
        );

        // 4. Increase Click Count
        url.clicks++;

        await url.save();

        // 5. Redirect
        return res.redirect(url.originalUrl);

    } catch (error) {

        next(error);

    }

};
const getAllUrls = async (req, res) => {
    try {
        const urls = await Url.find({
            user: req.user.id
        })
            .select("originalUrl shortCode clicks createdAt updatedAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: urls
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch URLs"
        });
    }
};
const deleteUrl = async (req, res) => {
    try {

        const { id } = req.params;

        const url = await Url.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        return res.status(200).json({
            message: "URL deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const getUrlAnalytics = async (req, res) => {
    try {

        const { id } = req.params;

        const url = await Url.findOne({
            _id: id,
            user: req.user.id
        }).select("-__v");

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: url
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const generateUrlQRCode = async (req, res) => {
    try {
        const { id } = req.params;

        const url = await Url.findOne({
            _id: id,
            user: req.user.id
        });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found"
            });
        }

        const shortUrl =
            `${process.env.BASE_URL}/${url.shortCode}`;

        const qrCode =
            await generateQRCode(shortUrl);

        return res.status(200).json({
            success: true,
            data: {
                shortCode: url.shortCode,
                shortUrl,
                qrCode
            }
        });

    } catch (error) {
        console.error("QR generation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate QR code"
        });
    }
};
module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getAllUrls,
    deleteUrl,
    getUrlAnalytics,
    generateUrlQRCode
};