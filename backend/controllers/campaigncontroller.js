const { validationResult } = require("express-validator")
const Campaign = require("../models/campaignmodel")
const Segment = require("../models/segmentmodel")
const Customer = require("../models/customermodel")
const User = require("../models/usermodel")

// Create a campaign
module.exports.createCampaign = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, segmentId, message, email } = req.body

    if (!name || !segmentId || !message || !email) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Find segment
    const segment = await Segment.findById(segmentId)
    if (!segment) {
      return res.status(404).json({ error: "Segment not found" })
    }

    // Calculate audience size based on segment criteria
    const audienceSize = await calculateAudienceSize(segment.criteria, user._id)

    const campaign = await Campaign.create({
      name,
      segmentId,
      message,
      audienceSize,
      createdBy: user._id,
    })

    return res.status(201).json({ campaign })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to create campaign" })
  }
}

// Send campaign
module.exports.sendCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await Campaign.findById(id).populate("segmentId")

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    // Get customers based on segment criteria
    const customers = await getCustomersBySegment(campaign.segmentId.criteria, campaign.createdBy)

    // Simulate sending messages
    const deliveryLog = []
    let sentCount = 0
    let failedCount = 0

    for (const customer of customers) {
      // Simulate 90% success rate
      const success = Math.random() > 0.1

      if (success) {
        sentCount++
        deliveryLog.push({
          customerId: customer._id,
          status: "Sent",
          timestamp: new Date(),
        })
      } else {
        failedCount++
        deliveryLog.push({
          customerId: customer._id,
          status: "Failed",
          timestamp: new Date(),
          errorMessage: "Failed to deliver message",
        })
      }
    }

    // Update campaign
    campaign.status = "Sent"
    campaign.sentCount = sentCount
    campaign.failedCount = failedCount
    campaign.sentAt = new Date()
    campaign.deliveryLog = deliveryLog

    await campaign.save()

    return res.status(200).json({ campaign })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to send campaign" })
  }
}

// Get all campaigns for a user
module.exports.getAllCampaigns = async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ error: "User email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const campaigns = await Campaign.find({ createdBy: user._id }).populate("segmentId", "name").sort({ createdAt: -1 })

    return res.status(200).json({ campaigns })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch campaigns" })
  }
}

// Get campaign by ID
module.exports.getCampaignById = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await Campaign.findById(id)
      .populate("segmentId", "name description criteria")
      .populate("deliveryLog.customerId", "name email")

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    return res.status(200).json({ campaign })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch campaign" })
  }
}

// Delete campaign
module.exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await Campaign.findByIdAndDelete(id)

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    return res.status(200).json({ message: "Campaign deleted successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to delete campaign" })
  }
}

// Helper function to calculate audience size
async function calculateAudienceSize(criteria, userId) {
  try {
    const customers = await getCustomersBySegment(criteria, userId)
    return customers.length
  } catch (err) {
    console.error(err)
    return 0
  }
}

// Helper function to get customers by segment criteria
async function getCustomersBySegment(criteria, userId) {
  try {
    // Parse criteria string to create MongoDB query
    const query = { userId }

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

    const customers = await Customer.find(query)
    return customers
  } catch (err) {
    console.error(err)
    return []
  }
}
