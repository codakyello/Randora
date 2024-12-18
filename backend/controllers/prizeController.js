const Event = require("../models/EventModel");
const Participant = require("../models/ParticipantsModel");
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

// Drawn handler
module.exports.assignPrize = catchAsync(async (req, res) => {
  const prizeId = req.params.id;
  const { participantId } = req.body;

  // Find the prize
  const prize = await Prize.findById(prizeId);
  if (!prize) {
    throw new AppError("Prize not found", 400); // Throw an error if the prize doesn't exist
  }

  const eventId = prize.eventId;

  const event = await Event.findById(eventId);

  if (!event) throw new AppError("Event not found", 400);

  // Check if the prize is still available
  if (prize.quantity <= 0) {
    throw new AppError("Prize is out of stock", 400); // Ensure there are available prizes
  }

  prize.quantity -= 1;

  await prize.save();

  if (event.remainingPrize <= 0) {
    throw new AppError("No prizes remaining", 400); // Prevent updating if no remaining prizes
  }

  // Reduce the remaining price on the event
  await Event.findByIdAndUpdate(eventId, {
    $inc: { remainingPrize: -1 },
    status: "active",
  });

  // update participant with prizeId and set isWinner true
  const participant = await Participant.findByIdAndUpdate(
    participantId,
    { prize: prizeId, isWinner: true },
    { new: true }
  );

  if (!participant) {
    throw new AppError("Participant not found", 404);
  }

  sendSuccessResponseData(res, "Participant updated successfully", participant);
});

module.exports.createPrizes = catchAsync(async (req, res) => {
  console.log(req.body);
  const prizes = req.body;
  const eventId = prizes.at(0).eventId;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  if (event.status !== "inactive") {
    throw new AppError(
      "Prizes can only be created when an event is inactive",
      400
    );
  }

  // Check for duplicate prize names within the event
  const existingPrizes = await Prize.find({ eventId });
  const existingPrizeNames = existingPrizes.map((prize) => prize.name);

  const duplicateNames = prizes
    .map((prize) => prize.name)
    .filter((name) => existingPrizeNames.includes(name));

  if (duplicateNames.length > 0) {
    throw new AppError(
      `${duplicateNames.join(
        ", "
      )} already exist. Consider updating the quantity instead.`,
      400
    );
  }

  // we also want to generate prize images using AI.
  const newPrizes = await Prize.insertMany(prizes);

  // Update event prize counts
  await Promise.all([
    Event.updatePrizeCount(eventId),
    Event.updateRemainingPrizeCount(eventId),
  ]);

  sendSuccessResponseData(res, "prizes", newPrizes);
});

module.exports.updatePrize = catchAsync(async (req, res) => {
  const { quantity } = req.body;

  const prize = await Prize.findById(req.params.id);

  if (!prize) {
    throw new AppError("Prize not found.", 404);
  }

  const event = await Event.findById(prize.eventId);

  const existingPrize = await Prize.findOne({
    name: req.body.name,
    eventId: prize.eventId,
  });

  console.log(prize);

  console.log(existingPrize);

  if (existingPrize && !existingPrize._id.equals(prize._id)) {
    throw new AppError("A Prize with this name already exists", 400);
  }

  if (event.status === "inactive") {
    for (const key in req.body) {
      prize[key] = req.body[key];
    }
    await prize.save();

    if (quantity) {
      await Promise.all([
        Event.updatePrizeCount(prize.eventId),
        Event.updateRemainingPrizeCount(prize.eventId),
      ]);
    }

    sendSuccessResponseData(res, "prize", prize);
  } else {
    throw new AppError(
      "Prizes can only be updated when the event is inactive.",
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

  await Promise.all([
    Event.updatePrizeCount(prize.eventId),
    Event.updateRemainingPrizeCount(prize.eventId),
  ]);

  sendSuccessResponseData(res, "prize");
});
