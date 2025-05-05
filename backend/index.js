require("dotenv").config();
const express = require("express");
const path = require("path");
const userRouter = require("./routes/userRoutes");
const songRouter = require("./routes/songRoutes");
const playlistRouter = require("./routes/playlistRoutes");
const cors = require("cors");
const connectDB = require("./utils/db");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: process.env.PUBLIC_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Updated to have a named parameter instead of just "*"
app.options("/*path", cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRouter);
app.use("/api/songs", songRouter);
app.use("/api/playlists", playlistRouter);
app.get("/", (req, res) => {
  res.send("🎵 Welcome to MusiQ360 API 🎶");
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🎧`));