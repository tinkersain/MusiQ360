const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserFavourites,
} = require("../controllers/userController");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User Profile Routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// User Data Routes
router.get("/getUserFavourites", getUserFavourites);

module.exports = router;