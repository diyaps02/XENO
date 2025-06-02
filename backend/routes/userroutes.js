const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/usercontroller");

router.post(
  "/register",
  [
    body("googleId").notEmpty().withMessage("Google ID is required"),
    body("displayName").notEmpty().withMessage("Display name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("role").notEmpty().withMessage("Role is required"),
    body("companyName").notEmpty().withMessage("Company name is required")
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("googleId").notEmpty().withMessage("Google ID is required")
  ],
  userController.loginUser
);

router.get("/getuser", userController.getUser);
router.post("/logout", userController.logoutUser);

module.exports = router;