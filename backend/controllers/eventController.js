// get event prizes

const Prize = require("../models/PrizesModel");
const Participant = require("../models/ParticipantsModel");

const { catchAsync } = require("../utils/helpers");

module.exports.getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find(); // Fetch all events
  sendSuccessResponseData(res, "events", events); // Send the events in response
});

// get events
module.exports.getEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  sendSuccessResponseData(res, "event", event);
});

//create event
module.exports.createEvent = catchAsync(async (req, res) => {
  const newEvent = await Event.create(req.body);

  sendSuccessResponseData(res, "event", newEvent);
});

module.exports.updateEvent = catchAsync(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  if (event.status === "ongoing" || event.status === "completed") {
    throw new AppError("Cannot update an ongoing or completed event.", 400);
  }

  sendSuccessResponseData(res, "event", event);
});

module.exports.getEventParticipants = catchAsync(async (req, res) => {
  const participants = await Participant.find({ eventId: req.params.eventId });

  sendSuccessResponseData(res, "participants", participants);
});

module.exports.getEventPrizes = catchAsync(async (req, res) => {
  const prizes = await Prize.find({ eventId: req.params.eventId });

  sendSuccessResponseData(res, "prizes", prizes);
});
