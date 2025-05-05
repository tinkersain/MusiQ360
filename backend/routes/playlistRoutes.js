const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playlistController");

// Playlist Routes (User ID is decoded from token in controller)
router.post("/", createPlaylist); // Create new playlist
router.get("/user", getUserPlaylists); // Get all playlists of the logged-in user
router.get("/:id", getPlaylistById); // Get a specific playlist by its ID
router.put("/:id", updatePlaylist); // Update playlist
router.delete("/:id", deletePlaylist); // Delete playlist

// Playlist Song Management
router.post("/:id/add", addSongToPlaylist); // Add song to playlist
router.post("/:id/remove", removeSongFromPlaylist); // Remove song from playlist

module.exports = router;