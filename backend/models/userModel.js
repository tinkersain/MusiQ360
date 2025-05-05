const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  resetPasswordActive: {
    type: Boolean
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
  }, ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);