const mongoose = require("mongoose");
const Participant = require("./ParticipantsModel");
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
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
    enum: ["active", "inactive", "completed", "cancelled"],
    default: "inactive",
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  participantCount: { type: Number, default: 0 },
});

eventSchema.statics.updateParticipantsCount = async function (eventId) {
  const count = await Participant.countDocuments({ eventId });
  await this.findByIdAndUpdate(eventId, { participantsCount: count });
};

// Create the model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
