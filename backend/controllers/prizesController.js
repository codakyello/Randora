const Prize = require("../models/PrizesModel");
const { sendSuccessResponseData } = require("../utils/helpers");

module.exports.getAllPrizes = catchAsync(async (req, res) => {});

module.exports.getPrize = catchAsync(async (req, res) => {});

module.exports.createPrize = catchAsync(async (req, res) => {
  const { eventId } = req.body;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  const newPrize = await Prize.create(req.body);

  sendSuccessResponseData(res, "prize", newPrize);
});

module.exports.updatePrize = catchAsync(async (req, res) => {
  const { eventId } = req.body;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  // Only allow updates when the event status is inactive
  if (event.status === "inactive" || event.status === "ongoing") {
    const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!prize) {
      throw new AppError("Prize not found.", 404);
    }

    sendSuccessResponseData(res, "prize", prize);
  } else {
    throw new AppError(
      "Prizes can only be updated when the event is inactive or ongoing.",
      400
    );
  }

  // Find and update the prize (using prize ID from the request)
});

module.exports.deletePrize = catchAsync(async (req, res) => {
  const { eventId } = req.body;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  // Only allow deletion when the event status is inactive
  if (event.status !== "inactive") {
    throw new AppError(
      "Prizes can only be deleted when the event is inactive.",
      400
    );
  }

  const prize = await Prize.findByIdAndDelete(req.params.id);

  if (!prize) {
    throw new AppError("Prize not found.", 404);
  }

  sendSuccessResponseData(res, "prize", null);
});
