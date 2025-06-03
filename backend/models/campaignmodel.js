const mongoose = require("mongoose")

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    segmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "segment",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    audienceSize: {
      type: Number,
      required: true,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Failed", "In Progress"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sentAt: {
      type: Date,
    },
    deliveryLog: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer",
        },
        status: {
          type: String,
          enum: ["Sent", "Failed"],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        errorMessage: String,
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("campaign", campaignSchema)
