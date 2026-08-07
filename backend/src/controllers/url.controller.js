const { redisClient } = require("../config/redis");
const Url = require("../models/url.model");
const { nanoid } = require("nanoid");

const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

if (!originalUrl) {
    return res.status(400).json({
        message: "Original URL is required"
    });
}
try {
    new URL(originalUrl);
} catch (error) {
    return res.status(400).json({
        message: "Invalid URL"
    });
}
const existingUrl = await Url.findOne({ originalUrl, user: req.user.id });

if (existingUrl) {
    return res.status(200).json({
        message: "Short URL already exists",
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`
    });
}

const shortCode = nanoid(7);

const url = await Url.create({
    originalUrl,
    shortCode,
    user: req.user.id
});

        return res.status(201).json({
            message: "Short URL created successfully",
            shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
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
            .select("originalUrl shortCode clicks createdAt")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: urls.length,
            data: urls
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
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
module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getAllUrls,
    deleteUrl,
    getUrlAnalytics
};