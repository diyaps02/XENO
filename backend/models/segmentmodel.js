const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  audienceSize: {
    type: Number,
    required: true,
    default: 0
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
 },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('segment', segmentSchema);
