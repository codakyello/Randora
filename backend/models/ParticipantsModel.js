const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid email!`,
    // },
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
