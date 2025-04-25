const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playlistController");

// Playlist Routes
router.post("/", createPlaylist);
router.get("/user/:userId", getUserPlaylists);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

// Playlist Song Management
router.post("/:id/add", addSongToPlaylist);
router.post("/:id/remove", removeSongFromPlaylist);

module.exports = router;
