const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Email must be at least 3 characters long"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    totalSpend: {
      type: Number,
      default: 0,
    },
    lastPurchase: {
      type: Date,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("customer", customerSchema);
