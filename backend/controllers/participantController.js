const {
  catchAsync,
  filterObj,
  sendSuccessResponseData,
} = require("../utils/helpers");
const fs = require("fs");
const csv = require("csv-parser");

const Participant = require("../models/ParticipantsModel");
const Event = require("../models/EventModel");
const AppError = require("../utils/appError");

module.exports.getAllParticipants = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not yet implemented",
  });
});

module.exports.getParticipant = catchAsync(async (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not yet implemented",
  });
});

module.exports.uploadParticipants = catchAsync(async (req, res) => {
  const csvFilePath = req.file?.path;
  if (!csvFilePath) throw new AppError("No CSV File uploaded", 400);

  try {
    const participants = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", () =>
          reject(new AppError("Error reading the CSV file.", 500))
        );
    });

    if (participants.length === 0) {
      throw new AppError("CSV file is empty.", 400);
    }

    const hasTicketNumber = participants[0].hasOwnProperty("ticketNumber");
    const hasEmail = participants[0].hasOwnProperty("email");
    const hasName = participants[0].hasOwnProperty("name");

    // Tickets number is compulsory
    if (!hasTicketNumber)
      throw new AppError(
        "You need to provide ticketNumbers. If you don't have, use our in built tool to generate unique ticket Numbers",
        400
      );

    //check if all email, name field exist
    const processedParticipants = participants.map((participant, index) => {
      const email = participant.email;
      const name = participant.name;
      const ticketNumber = participant.ticketNumber;
      const rowNumber = index + 2;

      // Check for missing fields
      // Since it is compulsory we do not have to check it
      if (!ticketNumber)
        throw new AppError(`Ticket Number at row ${rowNumber} is missing`, 400);

      if (hasEmail && !email) {
        throw new AppError(`Email at row ${rowNumber} is missing`, 400);
      }

      if (hasName && !name) {
        throw new AppError(`Name at row ${rowNumber} is missing`, 400);
      }

      // validate email
      if (hasEmail) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
          throw new AppError(`Invalid email address: ${email} `, 400);
        }
      }

      // Check for duplicates in email, ticketNumber,
      for (let i = index + 1; i < participants.length; i++) {
        // For duplicate Email
        if (hasEmail)
          if (participants[i].email === email) {
            throw new AppError(
              `Duplicate email address: ${email} at row ${rowNumber} and at row ${
                i + 2
              }.`,
              400
            );
          }
        // For duplicate ticket Numbers
        if (hasTicketNumber)
          if (participants[i].ticketNumber === ticketNumber) {
            throw new AppError(
              `Duplicate ticket number: Ticket Number ${ticketNumber} at row ${rowNumber} and at row ${
                i + 2
              }.`,
              400
            );
          }
      }

      return {
        name,
        email,
        ticketNumber,
        eventId: req.body.eventId,
      };
    });

    try {
      await Participant.insertMany(processedParticipants);
      sendSuccessResponseData(res, "participants", processedParticipants);
    } catch (error) {
      // Rollback by deleting participants with the same eventId
      await Participant.deleteMany({ eventId: req.body.eventId });

      throw new AppError(
        "Invalid input data. Please upload correct data.",
        400
      );
    }
  } catch (err) {
    throw err;
  } finally {
    // Delete the uploaded CSV file
    fs.unlink(csvFilePath, (unlinkErr) => {
      if (unlinkErr)
        console.error("Error deleting the file:", unlinkErr.message);
    });
  }
});

//Create participants manually
module.exports.createParticipant = catchAsync(async (req, res) => {
  const { ticketNumber, eventId } = req.body;

  if (!ticketNumber) {
    throw new AppError("Ticket Number is required", 400);
  }

  if (!eventId) {
    throw new AppError("Event ID is required", 400);
  }

  // Check for duplicate ticket number
  const existingParticipant = await Participant.findOne({
    eventId,
    ticketNumber,
  });

  if (existingParticipant) {
    throw new AppError(
      `The ticket number "${ticketNumber}" already exists for this event.`,
      400
    );
  }

  // Create a new participant
  const newParticipant = await Participant.create(req.body);

  sendSuccessResponseData(res, "participant", newParticipant);
});

module.exports.updateParticipant = catchAsync(async (req, res) => {
  const { ticketNumber, eventId, isWinner, email } = req.body;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  // Fetch the participant to ensure its existence
  const participant = await Participant.findById(req.params.id);
  if (!participant) {
    throw new AppError("No participant found with that ID.", 404);
  }

  // Handle `isWinner` updates
  if (isWinner) {
    if (event.status !== "ongoing") {
      throw new AppError(
        "Winner status can only be updated when the event is ongoing.",
        400
      );
    }

    participant.isWinner = isWinner;
    await participant.save();

    return sendSuccessResponseData(res, "participant", participant);
  }

  // Handle other updates (e.g., ticketNumber)
  if (event.status !== "inactive") {
    throw new AppError(
      "Participants can only be updated when the event is inactive.",
      400
    );
  }

  if (event.emailSent) {
    throw new AppError(
      "Updates are not allowed as the notification email has already been sent.",
      400
    );
  }

  // Ensure unique ticketNumber if being updated
  if (ticketNumber && ticketNumber !== participant.ticketNumber) {
    const existingParticipant = await Participant.findOne({
      eventId,
      ticketNumber,
    });

    if (existingParticipant) {
      throw new AppError(
        `The ticket number "${ticketNumber}" already exists for this event.`,
        400
      );
    }
  }

  if (email && email !== participant.email) {
    const existingParticipant = await Participant.findOne({
      eventId,
      email,
    });

    if (existingParticipant) {
      throw new AppError(
        `A participant with this email "${email}" already exists for this event.`,
        400
      );
    }
  }

  Object.keys(req.body).forEach((key) => {
    participant[key] = req.body[key];
  });

  // Save updated participant
  await participant.save();

  sendSuccessResponseData(res, "participant", participant);
});

module.exports.deleteParticipant = catchAsync(async (req, res) => {
  const { eventId } = req.body;

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

  // Delete the participant
  const participant = await Participant.findByIdAndDelete(req.params.id);
  if (!participant) {
    throw new AppError("No participant found with that ID.", 404);
  }

  sendSuccessResponseData(res);
});
