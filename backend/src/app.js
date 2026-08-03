const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const { redirectToOriginalUrl } = require("./controllers/url.controller");

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// Public redirect route
app.get("/:shortCode", redirectToOriginalUrl);

app.get("/", (req, res) => {
    res.send("API is running");
});

module.exports = app;