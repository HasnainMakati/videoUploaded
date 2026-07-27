require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./middleware/error.middleware.js");
const cors = require("cors")
const videoRoutes = require("./routes/video.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN_PRO,
    credentials:true
}))

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/videos", videoRoutes);

app.use(globalErrorHandler);

module.exports = {app}
