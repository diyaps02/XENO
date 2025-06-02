const csv = require("csv-parser");
const fs = require("fs");
const { validationResult } = require("express-validator");
const Customer = require("../models/customermodel");
const User = require("../models/usermodel");

module.exports.uploadCSV = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = req.body;
  const user = await User.findOne({ email });
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
        phoneNumber: row.phoneNumber,
        email: row.email.toLowerCase(),
        gender: row.gender,
        dob: new Date(row.dob),
        lastPurchase: new Date(row.lastPurchaseDate),
        totalSpend: Number(row.totalSpend),
        visitCount: Number(row.visitCount),
        createdBy: user._id,
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
};