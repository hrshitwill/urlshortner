const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const { redirectToOriginalUrl } = require("./controllers/url.controller");

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Public Redirect Route
app.get("/:shortCode", redirectToOriginalUrl);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running 🚀"
    });
});

module.exports = app;