const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  ticketNumber: {
    type: String,
    required: true,
  },
  // eventId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Event",
  //   required: true,
  // },
  eventId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isWinner: {
    type: Boolean,
    default: false,
  },
});

participantSchema.index({ ticketNumber: 1 });

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
