const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  desc: String,
  category: String,
  complexity: String,
});

module.exports = mongoose.model("question", questionSchema);
