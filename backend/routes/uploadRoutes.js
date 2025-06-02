const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Customer = require("../models/customermodel"); 
const { generateKey } = require("crypto");

const router = express.Router();

// Configure multer
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("file"), async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "User email is required in request body" });
  }
  const user = await require("../models/usermodel").findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const filePath = req.file.path;
  const customersArr = [];
  const company = user.companyName || "Fashionista";

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      customersArr.push({
        name: row.name,
        phoneNumber: row.phone,
        email: row.email.toLowerCase(),
        gender: row.gender,
        dob: new Date(row.dob),
        lastPurchase: new Date(row.lastPurchaseDate),
        totalSpend: Number(row.totalSpend),
        visitCount: Number(row.visitCount),
        userId: user._id,
        company: company
      });
    })
    .on("end", async () => {
      try {
        await Customer.insertMany(customersArr);
        fs.unlinkSync(filePath);
        res.status(200).json({ success: true, message: "Customers uploaded." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to insert customers" });
      }
    });
});

module.exports = router;
