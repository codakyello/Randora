const Event = require("../models/EventModel");
const Prize = require("../models/PrizesModel");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

const { sendSuccessResponseData, catchAsync } = require("../utils/helpers");

module.exports.getAllPrizes = catchAsync(async (req, res) => {
  const apiFeatures = APIFEATURES(Prize, req.query)
    .filter()
    .sort()
    .page()
    .paginate();

  const totalCount = await Prize.countDocuments();

  const prizes = await apiFeatures.query;

  sendSuccessResponseData(res, "prizes", prizes, totalCount);
});

module.exports.getPrize = catchAsync(async (req, res) => {
  const prize = await Prize.findById(req.params.id);

  if (!prize)
    throw new AppError("Prize with the given ID does not exist.", 404);

  sendSuccessResponseData(res, "prize", prize);
});

module.exports.createPrize = catchAsync(async (req, res) => {
  const { eventId } = req.body;

  // if they try to create a price with a name that already exist.
  const existingPrize = await Prize.findOne({ name: req.body.name, eventId });
  if (existingPrize) {
    throw new AppError(
      "A prize with this name already exists for the event. Consider increasing the quantity of the existing prize instead.",
      400
    );
  }
  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  const newPrize = await Prize.create(req.body);

  sendSuccessResponseData(res, "prize", newPrize);
});

module.exports.updatePrize = catchAsync(async (req, res) => {
  const prize = await Prize.findById(req.params.id);

  if (!prize) {
    throw new AppError("Prize not found.", 404);
  }

  const event = await Event.findById(prize.eventId);

  // Only allow updates when the event status is inactive or ongoing
  if (event.status === "inactive" || event.status === "ongoing") {
    for (const key in req.body) {
      prize[key] = req.body[key];
    }
    await prize.save();

    sendSuccessResponseData(res, "prize", prize);
  } else {
    throw new AppError(
      "Prizes can only be updated when the event is inactive or ongoing.",
      400
    );
  }
});

module.exports.deletePrize = catchAsync(async (req, res) => {
  const prize = await Prize.findByIdAndDelete(req.params.id);

  if (!prize) {
    throw new AppError("Prize not found.", 404);
  }

  const eventId = prize.eventId;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  if (event.status !== "inactive") {
    throw new AppError(
      "Prizes can only be deleted when the event is inactive.",
      400
    );
  }

  sendSuccessResponseData(res, "prize");
});
