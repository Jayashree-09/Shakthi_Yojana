const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // unique identifier
  value: { type: String, required: true }, // content
});

module.exports = mongoose.model("Content", contentSchema);