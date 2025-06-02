const express = require("express");
const { body } = require("express-validator");
const segmentController = require("../controllers/segmentcontroller");
const router = express.Router();

// Create a segment
router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("criteria").notEmpty().withMessage("Criteria is required"),
    body("email").isEmail().withMessage("A valid user email is required")
  ],
  segmentController.createSegment
);

// Get all segments
router.get("/all", segmentController.getAllSegments);

// Get a single segment by ID
router.get("/:id", segmentController.getSegmentById);

// Update a segment
router.put("/:id", segmentController.updateSegment);

// Delete a segment
router.delete("/:id", segmentController.deleteSegment);

module.exports = router;
