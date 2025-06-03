const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {getProfile,createUser} = require("../controllers/usercontroller");

router.post(
  "/register",
  [
    body("googleId").notEmpty().withMessage("Google ID is required"),
    body("displayName").notEmpty().withMessage("Display name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("role").notEmpty().withMessage("Role is required"),
    body("companyName").notEmpty().withMessage("Company name is required")
  ],
  createUser
);


router.get("/profile", getProfile);


module.exports = router;