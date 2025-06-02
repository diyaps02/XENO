const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const uploadController = require("../controllers/uploadcontroller");
const router = express.Router();

// Configure multer
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload-csv",
  [
    upload.single("file"),
    body("email").isEmail().withMessage("A valid user email is required")
  ],
  uploadController.uploadCSV
);

module.exports = router;
