const express = require("express");
const participantController = require("../controllers/participantController");
const { authenticate, authorize } = require("../controllers/authController");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  dest: "uploads/", // Define where files should be stored
  fileFilter: (req, file, cb) => {
    console.log("here");
    if (file.mimetype === "text/csv") {
      cb(null, true); // Accept CSV files
    } else {
      cb(new Error("Only CSV files are allowed."), false); // Reject non-CSV files
    }
  },
});

router.post(
  "/upload",
  upload.single("file"),
  participantController.uploadParticipants
);

router
  .route("/")
  .get(
    authenticate,
    authorize("admin"),
    participantController.getAllParticipants
  )
  .post(
    authenticate,
    authorize("user"),
    participantController.createParticipant
  );

module.exports = router;
