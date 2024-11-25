const {
  catchAsync,
  generateUniqueRandomNumber,
  filterObj,
  sendSuccessResponseData,
} = require("../utils/helpers");
const fs = require("fs");
const csv = require("csv-parser");

const Participant = require("../models/ParticipantsModel");
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
  console.log("This is Csv file path", csvFilePath);
  if (!csvFilePath) throw new AppError("No CSV file uploaded", 400);

  // we will check for non repeating emails as well as non repeating ticketNumbers before inserting into db.
  // show an error found duplicate email and ticketNumber. Correct this and upload again

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

    const numberOfRows = participants.length * 10;
    const hasTicketNumber = participants[0]?.ticketNumber;
    const generateTicketNumber = generateUniqueRandomNumber(numberOfRows);

    //check if all email and name field exist
    const processedParticipants = participants.map((participant, index) => {
      const email = participant.email;
      const name = participant.name;
      const ticketNumber = participant.ticketNumber;

      if (!name || !email) {
        throw new AppError(
          "Each participant must have a valid name and email.",
          400
        );
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        throw new AppError(
          `Invalid email address: ${email} for participant: ${name}`,
          400
        );
      }

      for (let i = index + 1; i < participants.length; i++) {
        // For duplicate Email
        if (participants[i].email === email) {
          throw new AppError(`Duplicate email address ${email}`, 400);
        }

        // For duplicate ticket Numbers
        if (hasTicketNumber)
          if (participants[i].ticketNumber === ticketNumber) {
            throw new AppError(
              `A duplicate ticket number was detected: Ticket-${ticketNumber}. Please ensure all ticket numbers are unique.`,
              400
            );
          }
      }

      return {
        name: participant.name,
        email: participant.email,
        ticketNumber: hasTicketNumber ? ticketNumber : generateTicketNumber(),
        eventId: req.body.eventId,
      };
    });

    try {
      await Participant.insertMany(processedParticipants);
      sendSuccessResponseData(res, "participants", processedParticipants);
    } catch (error) {
      // Rollback by deleting participants with the same eventId
      await Participant.deleteMany({ eventId: req.body.eventId });
      console.log(error);
      // await Participant.deleteMany({ eventId: req.body.eventId });
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

module.exports.createParticipants = catchAsync(async (req, res) => {
  const participantsData = req.body.participants;

  if (!Array.isArray(participantsData) || participantsData.length === 0) {
    throw new AppError(
      "Participants data is required and should be more than one participant",
      400
    );
  }

  const participantsNumber = participantsData.length;
  const hasTicketNumber = participantsData[0]?.ticketNumber;
  const generateTicketNumber = generateUniqueRandomNumber(participantsNumber);

  const participants = participantsData.map((participant) => {
    if (!participant.name || !participant.email) {
      throw new AppError("Each participant must have a name and email.", 400);
    }

    // once it sees first ticket number use it for, if there is a field with a ticket number mission it will throw an error
    // But if the first dosent have a ticket number then we will genrate all the ticket number
    // Its either they generate all the ticket numbers or we generate all the ticket numbers
    return {
      name: participant.name,
      email: participant.email,
      ticketNumber: hasTicketNumber || generateTicketNumber(),
      eventId: req.body.eventId,
    };
  });

  try {
    const createdParticipants = await Participant.insertMany(participants);
    sendSuccessResponseData(res, "participants", createdParticipants);
  } catch (err) {
    await Participant.deleteMany({ eventId: req.body.eventId });
    throw err;
  }
});

module.exports.updateParticipant = catchAsync(async (req, res) => {
  const obj = filterObj(req.body, "isWinner");

  const participant = await Participant.findByIdAndUpdate(req.params.id, obj, {
    new: true,
  });

  if (!participant) {
    throw new AppError("No participant found with that ID.", 404);
  }

  sendSuccessResponseData(res, "participant", participant);
});
