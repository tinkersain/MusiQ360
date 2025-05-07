require("dotenv").config();
const express = require("express");
const path = require("path");
const userRouter = require("./routes/userRoutes");
const songRouter = require("./routes/songRoutes");
const playlistRouter = require("./routes/playlistRoutes");
const cors = require("cors");
const connectDB = require("./utils/db");
const Song = require("./models/songModel");
const {
  title
} = require("process");

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
app.use("/songs", express.static(path.join(__dirname, "songs")));

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

async function addSongs() {
  const songs = [{
      title: "A Dream Is A Wish",
      artist: "Ilene Woods",
      album: "Cinderella (Original Motion Picture Soundtrack)",
      genre: "Soundtrack",
      url: `/songs/${title}`,
    },
    {
      title: "A Thousand Years",
      artist: "Christina Perri",
      album: "The Twilight Saga: Breaking Dawn – Part 1 (Original Motion Picture Soundtrack)",
      genre: "Pop",
      url: "",
    },
    {
      title: "All I Ever Wanted",
      artist: "Basshunter",
      album: "Now You're Gone – The Album",
      genre: "Eurodance",
      url: "",
    },
    {
      title: "All Of Me",
      artist: "John Legend",
      album: "Love in the Future",
      genre: "R&B/Soul",
      url: "",
    },
    {
      title: "All or Nothing",
      artist: "O‑Town",
      album: "O‑Town",
      genre: "Pop",
      url: "",
    },
    {
      title: "All We Are",
      artist: "Warlock",
      album: "Triumph and Agony",
      genre: "Heavy Metal",
      url: "",
    },
    {
      title: "Alone No One",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Aly And AJ No One",
      artist: "Aly & AJ",
      album: "Into the Rush",
      genre: "Pop Rock",
      url: "",
    },
    {
      title: "And I Know It",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Angel of mine",
      artist: "Monica",
      album: "The Boy Is Mine",
      genre: "R&B",
      url: "",
    },
    {
      title: "Are You Gonna",
      artist: "Lenny Kravitz",
      album: "Are You Gonna Go My Way",
      genre: "Rock",
      url: "",
    },
    {
      title: "Baby Steps",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Back at One",
      artist: "Brian McKnight",
      album: "Back at One",
      genre: "R&B",
      url: "",
    },
    {
      title: "Battle ships",
      artist: "Daughtry",
      album: "Baptized",
      genre: "Rock",
      url: "",
    },
    {
      title: "Becoming Purcell",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Been Here All Along",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Beneath Your Beautiful",
      artist: "Labrinth feat. Emeli Sandé",
      album: "Electronic Earth",
      genre: "R&B/Soul",
      url: "",
    },
    {
      title: "better with the lights off",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    },
    {
      title: "Between The Raindrops",
      artist: "Colbie Caillat feat. Christina Perri",
      album: "All of You",
      genre: "Pop",
      url: "",
    },
    {
      title: "Between You and I",
      artist: "Unknown",
      album: "",
      genre: "",
      url: "",
    }
  ];

  songs.forEach(async (item) => {
    await Song.create({
      title: item.title,
      artist: item.artist || "Unknown",
      album: item.album || "Single",
      genre: item.genre || "Common",
      url: `/songs/${item.title}.mp3`,
    });
    console.log("this done");
  });
}

// addSongs();