const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["raffle", "spin-the-wheel", "trivia", "giveaway"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  csvUploaded: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["ongoing", "inactive", "completed", "cancelled"],
    default: "inactive",
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
});

// Create the model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
