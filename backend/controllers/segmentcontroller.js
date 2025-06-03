const { validationResult } = require("express-validator")
const Segment = require("../models/segmentmodel")
const User = require("../models/usermodel")

// Create a segment based on a rule (criteria)
module.exports.createSegment = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { name, description, criteria, email } = req.body
    if (!name || !description || !criteria || !email) {
      return res.status(400).json({ error: "All fields are required (name, description, criteria, email)" })
    }
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    // Calculate audience size based on criteria
    const audienceSize = await calculateAudienceSize(criteria, user._id)

    // Create segment with user._id as createdBy
    const segment = await Segment.create({
      name,
      description,
      criteria,
      createdBy: user._id,
      audienceSize
    });
    return res.status(201).json({ segment })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to create segment" })
  }
}

// Get all segments
module.exports.getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find()
    return res.status(200).json({ segments })
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch segments" })
  }
}

// Get a segment by ID
module.exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
    if (!segment) return res.status(404).json({ error: "Segment not found" })
    return res.status(200).json({ segment })
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch segment" })
  }
}

// Update a segment
module.exports.updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!segment) return res.status(404).json({ error: "Segment not found" })
    return res.status(200).json({ segment })
  } catch (err) {
    return res.status(500).json({ error: "Failed to update segment" })
  }
}

// Delete a segment
module.exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id)
    if (!segment) return res.status(404).json({ error: "Segment not found" })
    return res.status(200).json({ message: "Segment deleted" })
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete segment" })
  }
}

// Preview audience size for a segment criteria
module.exports.previewAudienceSize = async (req, res) => {
  try {
    const { criteria, email } = req.body

    if (!criteria || !email) {
      return res.status(400).json({ error: "Criteria and email are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Calculate audience size based on criteria
    const audienceSize = await calculateAudienceSize(criteria, user._id)

    return res.status(200).json({ audienceSize })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to preview audience size" })
  }
}

// Helper function to calculate audience size
async function calculateAudienceSize(criteria, userId) {
  try {
    const Customer = require("../models/customermodel")

    // Parse criteria string to create MongoDB query
    const query = { userId }
    console.log("usetId:", userId);
    // Simple criteria parsing - you can make this more sophisticated
    if (criteria.includes("totalSpend >")) {
      const amount = Number.parseInt(criteria.match(/totalSpend > (\d+)/)?.[1] || 0)
      query.totalSpend = { $gt: amount }
    }

    if (criteria.includes("gender =")) {
      const gender = criteria.match(/gender = "([^"]+)"/)?.[1]
      if (gender) query.gender = gender
    }

    if (criteria.includes("visitCount >")) {
      const visits = Number.parseInt(criteria.match(/visitCount > (\d+)/)?.[1] || 0)
      query.visitCount = { $gt: visits }
    }

    const count = await Customer.countDocuments(query)
  console.log("Audience size query:", query)
    console.log("Audience size count:", count)
    return count
  } catch (err) {
    console.error(err)
    return 0
  }
}
