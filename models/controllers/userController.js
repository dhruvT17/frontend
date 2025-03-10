const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Credentials = require("../models/Credentials");
const User = require("../models/User");

// ✅ Get all users (Admin-only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("credentialId", "username role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("credentialId", "username role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Create a new user (Admin use case)
const createUser = async (req, res) => {
  try {
    const { username, password, role, name, email, contact_number, address, skills, preferences } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create credentials first
    const credential = new Credentials({ username, password: hashedPassword, role });
    await credential.save();

    // Create User
    const user = new User({
      credentialId: credential._id,
      name,
      email,
      contact_number,
      address,
      skills,
      preferences
    });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// ✅ Register User (Public Sign-Up)
const registerUser = async (req, res) => {
  try {
    console.log("Register user request received");
    const { username, name, contact_number, email, password, role } = req.body;

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if contact_number is provided
    if (!contact_number) {
      return res.status(400).json({ message: "Contact number is required" });
    }

    console.log("Request body:", req.body);

    let existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create Credentials
    const credential = new Credentials({ username, password: hashedPassword, role });
    await credential.save();
    console.log("Credential created:", credential);

    // Create User profile
    const user = new User({
      credentialId: credential._id,
      name,
      email,
      contact_number,
    });
    await user.save();
    console.log("User created:", user);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find credentials using username
    const credentials = await Credentials.findOne({ username });
    if (!credentials) return res.status(400).json({ message: "Invalid credentials" });

    // Verify password
    const isMatch = await bcrypt.compare(password, credentials.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { credentialId: credentials._id, role: credentials.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update user details (Authenticated users)
const updateUser = async (req, res) => {
  try {
    const { name, email, contact_number, address, skills, preferences } = req.body;
    
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.contact_number = contact_number || user.contact_number;
    user.address = address || user.address;
    user.skills = skills || user.skills;
    user.preferences = preferences || user.preferences;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete user (Admin-only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete related credentials
    await Credentials.findByIdAndDelete(user.credentialId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
  
