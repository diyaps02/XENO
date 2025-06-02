const { validationResult } = require("express-validator");
const Segment = require("../models/segmentmodel");
const User = require("../models/usermodel");

// Create a segment based on a rule (criteria)
module.exports.createSegment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, description, criteria, email } = req.body;
    if (!name || !description || !criteria || !email) {
      return res.status(400).json({ error: "All fields are required (name, description, criteria, email)" });
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Create segment with user._id as createdBy
    const segment = await Segment.create({
      name,
      description,
      criteria,
      createdBy: user._id
    });
    return res.status(201).json({ segment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create segment" });
  }
};

// Get all segments
module.exports.getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find();
    return res.status(200).json({ segments });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch segments" });
  }
};

// Get a segment by ID
module.exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    return res.status(200).json({ segment });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch segment" });
  }
};

// Update a segment
module.exports.updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    return res.status(200).json({ segment });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update segment" });
  }
};

// Delete a segment
module.exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    return res.status(200).json({ message: "Segment deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete segment" });
  }
};