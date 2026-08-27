require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./middleware/error.middleware.js");
const cors = require("cors")
const videoRoutes = require("./routes/video.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN_PRO || process.env.CORS_ORIGIN_DEV || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)

app.use(cors({
    origin: (requestOrigin, callback) => {
        if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
            return callback(null, true)
        }
        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials:true
}))

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({success: true, message: "Video API is running"})
})

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/videos", videoRoutes);

app.use(globalErrorHandler);

module.exports = app
