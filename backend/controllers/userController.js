const User = require("../models/userModel");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync, filterObj } = require("../utils/helpers");
const { sendSuccessResponseData } = require("../utils/helpers");

module.exports.getAllUser = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(User, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const users = await apiFeatures.query;

  const totalUsers = await User.countDocuments({ active: true });

  sendSuccessResponseData(res, "users", users, totalUsers);
});

module.exports.updateMe = catchAsync(async (req, res, _next) => {
  // 1) Throw error if user Post password data
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError(
      "This route is not for password updates. Please use /update-my-password",
      400
    );

  // 2) We dont want to update the email and name and other sensitive info
  const filteredBody = filterObj(req.body, "logo", "image", "userName");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  sendSuccessResponseData(res, "user", updatedUser);
});

module.exports.deleteMe = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) throw new AppError("User not found", 404);

  res.status(204).json({});
});

module.exports.getUser = catchAsync(async function (req, res) {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "user", user);
});

module.exports.getUserByEmail = catchAsync(async function (req, res) {
  const email = req.query.email;
  const user = await User.findOne({ email });
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "user", user);
});

module.exports.Me = catchAsync(async function (req, res) {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "user", user);
});

module.exports.getMyDelivery = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Delivery.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const deliveries = await apiFeatures.query;

  sendSuccessResponseData(res, "deliveries", deliveries);
});

module.exports.getMyNotifications = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Notifications.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const notifications = await apiFeatures.query;

  sendSuccessResponseData(res, "notifications", notifications);
});

module.exports.getUserDelivery = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Delivery.find({ user: req.params.id }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const deliveries = await apiFeatures.query;

  sendSuccessResponseData(res, "deliveries", deliveries);
});

module.exports.getUserNotifications = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Notifications.find({ user: req.params.id }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const notifications = await apiFeatures.query;

  sendSuccessResponseData(res, "notifications", notifications);
});
