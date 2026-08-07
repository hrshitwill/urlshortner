const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        return `${req.ip}-${req.body.email}`;
    },

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login after 5 minutes attempts."
    }
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many registration attempts. Please try again later."
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

module.exports = {
    loginLimiter,
    registerLimiter,
    apiLimiter
};