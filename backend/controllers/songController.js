const Song = require("../models/songModel");

// Upload a song (admin)
const uploadSong = async (req, res) => {
  const {
    title,
    artist,
    album,
    genre,
    url
  } = req.body;

  try {
    const newSong = await Song.create({
      title,
      artist,
      album,
      genre,
      url,
    });
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get a song by ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(404).json({
      message: "Song not found"
    });
  }
};

// Update song info
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete a song
const deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({
      message: "Song deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Export all functions
module.exports = {
  uploadSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
};