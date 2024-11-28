const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/errorController");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const AppError = require("./utils/appError");

const userRoutes = require("./routes/userRoutes");
const participantRoutes = require("./routes/participantRoute");
const eventRoutes = require("./routes/eventRoutes");
const prizeRoutes = require("./routes/prizeRoute");

dotenv.config({ path: "./config.env" });

const app = express();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

app.use(cors());

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use(bodyParser.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(
  hpp({
    whitelist: [],
  })
);

app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/participants", participantRoutes);

app.use("/api/v1/events", eventRoutes);

app.use("/api/v1/prizes", prizeRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>Deployment Check</h1>");
});

app.get("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
