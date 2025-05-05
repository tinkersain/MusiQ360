const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  genre: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  searchKeywords: [{
    type: String,
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model("Song", songSchema);