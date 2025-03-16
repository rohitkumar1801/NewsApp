const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if the user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create and save the new user
    const user = new User({ name: fullname, email, password });
    await user.save();

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: false, // Use HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "User is not registered",
      error: error.toString(), // Convert error to string for clarity
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access (secure)
      secure: false, // Use HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({ message: "Logout successful" });
};

exports.getProfile = async (req, res) => {
  
  const token = req.cookies.token;

  // console.log("cookies", req.cookies)

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  console.log("cookies", req.cookies)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Invalid token" });
  }
};
