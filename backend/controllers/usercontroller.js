const usermodel = require("../models/usermodel");
const userService = require("../services/userservices");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  const existingUser = await usermodel.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const { googleId, displayName, email, avatar, role, companyName } = req.body;
  try {
    const user = await userService.createUser({
      googleId,
      displayName,
      email,
      avatar,
      role,
      companyName,
    });
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  const { email, googleId } = req.body;
  const user = await usermodel.findOne({ email, googleId });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.status(200).json({ user });
};

module.exports.getUser = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user });
};

module.exports.logoutUser = async (req, res, next) => {
  return res.status(200).json({ message: "Logged out successfully" });
};