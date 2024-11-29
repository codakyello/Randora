const Prize = require("../models/PrizesModel");
const Participant = require("../models/ParticipantsModel");
const Event = require("../models/EventModel");
const { catchAsync, sendSuccessResponseData } = require("../utils/helpers");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

module.exports.getAllEvents = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Event, req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = Event.countDocuments();

  const events = await apiFeatures.query;

  sendSuccessResponseData(res, "events", events, totalCount);
});

// get events
module.exports.getEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  sendSuccessResponseData(res, "event", event);
});

//create event
module.exports.createEvent = catchAsync(async (req, res) => {
  const newEvent = await Event.create({ ...req.body, userId: req.user.id });

  sendSuccessResponseData(res, "event", newEvent);
});

module.exports.updateEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  if (event.status === "active" || event.status === "completed") {
    throw new AppError(`Cannot update an ${event.status} event.`, 400);
  }

  Object.keys(req.body).forEach((key) => {
    event[key] = req.body[key];
  });

  await event.save();
  sendSuccessResponseData(res, "event", event);
});

module.exports.deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  if (event.status === "active") {
    throw new AppError("You cannot delete an ongoing event.", 400);
  }

  await Promise.all([
    Prize.deleteMany({ eventId: id }),
    Participant.deleteMany({ eventId: id }),
  ]);

  await Event.findByIdAndDelete(id);

  sendSuccessResponseData(res, "event");
});

module.exports.getEventParticipants = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(
    Participant.find({ eventId: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = await Participant.find({
    eventId: req.params.id,
  }).countDocuments();

  const participants = await apiFeatures.query;

  sendSuccessResponseData(res, "participants", participants, totalCount);
});

module.exports.getEventPrizes = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(
    Prize.find({ eventId: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = await Event.countDocuments();

  const prizes = await apiFeatures.query;

  sendSuccessResponseData(res, "prizes", prizes, totalCount);
});

module.exports.deleteEventParticipants = catchAsync(async (req, res) => {
  const { id: eventId } = req.params;

  if (!eventId) throw new AppError("You need to specify an event Id", 400);

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  // Ensure event is inactive and emails have not been sent
  if (event.status !== "inactive") {
    throw new AppError(
      "Participants can only be deleted when the event is inactive.",
      400
    );
  }

  if (event.emailSent) {
    throw new AppError(
      "Participants cannot be deleted as the notification email has already been sent.",
      400
    );
  }

  // Delete the participants
  await Participant.deleteMany({ eventId });

  // Set the csv to free
  event.csvUploaded = false;

  await event.save();

  sendSuccessResponseData(res, "participants");
});
