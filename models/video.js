const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Video", videoSchema);
