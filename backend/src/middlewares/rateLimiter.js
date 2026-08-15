const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    keyGenerator: (req) => {
        return ipKeyGenerator(req.ip);
    },

    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes."
    }
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    keyGenerator: (req) => {
        return ipKeyGenerator(req.ip);
    },

    message: {
        success: false,
        message: "Too many registration attempts. Please try again later."
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,

    keyGenerator: (req) => {
        return ipKeyGenerator(req.ip);
    },

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