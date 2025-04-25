const express = require("express");
const router = express.Router();
const {
  uploadSong,
  getAllSongs,
  getSongById,
  deleteSong,
  updateSong,
} = require("../controllers/songController");

// Song Routes
router.post("/upload", uploadSong); // Admin use
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

module.exports = router;
