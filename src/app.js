// dotenv ko configuration ke sath ek hi line me require kar sakte hain
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./middleware/error.middleware.js");
const videoRoutes = require("./routes/video.routes.js");

const app = express();

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/videos", videoRoutes);

app.use(globalErrorHandler);

module.exports = {app}
