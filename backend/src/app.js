const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const apiLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/error.middleware");

const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const { redirectToOriginalUrl } = require("./controllers/url.controller");

const app = express();

// Security
app.use(helmet());
app.use(morgan("dev"));

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://urlshortner-brown.vercel.app"
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Rate Limiter
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Redirect Route
app.get("/:shortCode", redirectToOriginalUrl);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running 🚀"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;