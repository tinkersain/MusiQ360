const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {
  constants
} = require("../utils/contsants");
const {
  generateToken,
  decodeToken
} = require("../utils/common");

// Register new user
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;

  try {
    const userExists = await User.findOne({
      email
    });
    if (userExists)
      res.status(400).json({
        message: constants.userAlreadyExist
      });
    const hashedPassword = await bcrypt.hash(password, constants.hashedPasswordSaltLength);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      resetPasswordActive: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await User.findOne({
      email
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: constants.invalidCredentials
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = decodeToken(token).id;
    if (userId) {
      const user = await User.findById(userId).select("-_id -password -createdAt -updatedAt");
      res.status(200).json(user);
    } else {
      res.status(400).json(constants.invalidAuthentication);
    }
  } catch (error) {
    res.status(404).json({
      message: constants.userNotFound
    });
  }
};

// Get user Favourites
const getUserFavourites = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = decodeToken(token);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({
        message: constants.invalidAuthentication
      });
    }

    const user = await User.findById(userId)
      .select("favourites")
      .populate("favourites");
    if (!user) {
      return res.status(404).json({
        message: constants.userNotFound
      });
    }

    res.status(200).json({
      favourites: user.favourites
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};


// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = decodeToken(token);
    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({
        message: constants.invalidAuthentication
      });
    }

    const user = await User.findOne({
      _id: userId
    });

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = await bcrypt.hash(password, constants.hashedPasswordSaltLength);
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({
        message: constants.userNotFound
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Export all at once
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserFavourites,
};