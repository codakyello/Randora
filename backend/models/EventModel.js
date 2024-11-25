const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["raffle", "spin-the-wheel", "quiz", "giveaway"],
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
    totalTickets: {
      type: Number,
      default: 0, // Track the total tickets for the event
    },
    winners: [
      {
        type: Schema.Types.ObjectId,
        ref: "Participants", // Users who won in the event
      },
    ],

    csvUpload: {
      fileName: {
        type: String,
        required: false, // Name of the uploaded CSV file (if any)
      },
      fileUrl: {
        type: String,
        required: false, // URL or path where the CSV file is stored (in case you're using a cloud storage solution like AWS S3)
      },
      processed: {
        type: Boolean,
        default: false, // Flag to check if the CSV has been processed and the ticket numbers have been assigned
      },
    },
    status: {
      type: String,
      enum: ["ongoing", "past", "canceled"],
      default: "active",
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User", // The user (vendor/admin) who created the event
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Create the model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
