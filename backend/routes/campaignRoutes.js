const express = require("express");
const { body } = require("express-validator");
const campaignController = require("../controllers/campaigncontroller");
const router = express.Router();

// Create a campaign
router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("segmentId").notEmpty().withMessage("Segment ID is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("email").isEmail().withMessage("A valid user email is required")
  ],
  campaignController.createCampaign
);

// Send a campaign
router.post("/:id/send", campaignController.sendCampaign);

// Get all campaigns for a user
router.get("/all", campaignController.getAllCampaigns);

// Get a single campaign by ID
router.get("/:id", campaignController.getCampaignById);

// Delete a campaign
router.delete("/:id", campaignController.deleteCampaign);

module.exports = router;