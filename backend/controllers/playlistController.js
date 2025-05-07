const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");
const {
    constants
} = require("../utils/contsants");
const {
    decodeToken
} = require("../utils/common");

// Create a new playlist
const createPlaylist = async (req, res) => {
    const {
        name
    } = req.body; // Assuming songs is an array of song IDs
    const token = req.headers.authorization.split(" ")[1];

    try {
        const decoded = decodeToken(token); // Decode the token to get the user ID
        const userId = decoded.id; // Extract the user ID from the decoded token

        const playlist = await Playlist.create({
            name,
            user: userId, // Use decoded user ID
            songs: [],
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get all playlists of a user (with populated songs)
const getUserPlaylists = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get the token from Authorization header

    try {
        const decoded = decodeToken(token); // Decode the token to get the user ID
        const userId = decoded.id; // Extract the user ID from the decoded token

        const playlists = await Playlist.find({
            user: userId,
        }).populate("songs"); // Populating the songs field to get the full song data

        res.json(playlists);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get a playlist by ID (with populated songs)
const getPlaylistById = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get the token from Authorization header

    try {
        const decoded = decodeToken(token); // Decode the token to get the user ID
        const userId = decoded.id; // Extract the user ID from the decoded token

        const playlist = await Playlist.findById(req.params.id).populate("songs"); // Populating the songs field to get the full song data

        if (!playlist || playlist.user.toString() !== userId) {
            return res.status(404).json({
                message: constants.playlistNotFound,
            });
        }

        res.json(playlist);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update a playlist
const updatePlaylist = async (req, res) => {
    const {
        name,
        songs
    } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Get the token from Authorization header

    try {
        const decoded = decodeToken(token); // Decode the token to get the user ID
        const userId = decoded.id; // Extract the user ID from the decoded token

        const playlist = await Playlist.findById(req.params.id);

        // Ensure that the user owns the playlist before allowing the update
        if (!playlist || playlist.user.toString() !== userId) {
            return res.status(404).json({
                message: constants.playlistNotFound,
            });
        }

        // Update the playlist
        playlist.name = name || playlist.name;
        playlist.songs = songs || playlist.songs;

        const updatedPlaylist = await playlist.save();
        await updatedPlaylist.populate("songs"); // Populate the songs after the update

        res.json(updatedPlaylist);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get the token from Authorization header

    try {
        const decoded = decodeToken(token); // Decode the token to get the user ID
        const userId = decoded.id; // Extract the user ID from the decoded token

        const playlist = await Playlist.findById(req.params.id);

        // Ensure that the user owns the playlist before allowing the delete
        if (!playlist || playlist.user.toString() !== userId) {
            return res.status(404).json({
                message: constants.playlistNotFound,
            });
        }

        // Delete the playlist
        await playlist.remove();
        res.json({
            message: "Playlist deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Add a song to a playlist
const addSongToPlaylist = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const {
        songId
    } = req.body; // Expecting songId in body
    const playlistId = req.params.id;

    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist || playlist.user.toString() !== userId) {
            return res.status(404).json({
                message: constants.playlistNotFound,
            });
        }

        // Check if song already exists in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({
                message: "Song already in playlist",
            });
        }

        playlist.songs.push(songId);
        await playlist.save();
        await playlist.populate("songs");

        res.json({
            message: "Song added",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Remove a song from a playlist
const removeSongFromPlaylist = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const {
        songId
    } = req.body; // Expecting songId in body
    const playlistId = req.params.id;

    try {
        const decoded = decodeToken(token);
        const userId = decoded.id;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist || playlist.user.toString() !== userId) {
            return res.status(404).json({
                message: constants.playlistNotFound,
            });
        }

        // Remove the song if it exists
        playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
        await playlist.save();
        await playlist.populate("songs");

        res.json({
            message: "Song removed",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Export all functions
module.exports = {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
};