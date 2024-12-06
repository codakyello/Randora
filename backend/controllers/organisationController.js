const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const Organisation = require("../models/organisationModel");
const { FRONTEND_URL } = require("../utils/const");
const crypto = require("crypto");
const { catchAsync, sendSuccessResponseData } = require("../utils/helpers");

module.exports.validateInvite = catchAsync(async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token is required" });

  // Find organisation and match the invite by token and expiry
  const organisation = await Organisation.findOne(
    {
      "collaborators.token": token,
      "collaborators.expiresAt": { $gt: new Date() },
    },
    { "collaborators.$": 1 } // Return only the matched collaborator
  );

  if (!organisation || !organisation.collaborators.length) {
    return res.status(404).json({ error: "Invite not found or has expired" });
  }

  const invite = organisation.collaborators[0];

  return res.status(200).json({
    status: "success",
    data: {
      email: invite.email,
      expiresAt: invite.expiresAt,
      status: invite.status,
    },
  });
});

module.exports.sendInvite = catchAsync(async (req, res) => {
  const organisationId = req.params.id;
  const { email: userEmail } = req.body;

  if (!userEmail)
    throw new AppError("Email is compulsory to send an invite", 400);

  const organisation = await Organisation.findById(organisationId);
  if (!organisation)
    throw new AppError("No organisation found with this ID", 404);

  const existingInvite = organisation.collaborators.find(
    (collaborator) =>
      collaborator.email === userEmail && collaborator.status === "pending"
  );
  if (existingInvite)
    throw new AppError(
      "This user has already been invited and not responded yet",
      400
    );

  const token = crypto.randomBytes(32).toString("hex");

  // 2 days expiry
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new AppError("User not found", 404);

  const invite = {
    email: user.email,
    userName: user.userName,
    token,
    expiresAt,
    status: "pending",
  };

  const inviteUrl = `${FRONTEND_URL}/collaborators/invite?token=${token}`;
  const inviter = await User.findById(organisation.owner);

  try {
    const email = new Email(user);

    await email.sendInvite(inviteUrl, inviter.userName);
  } catch (err) {
    throw new AppError("There was a problem sending the invite", 500);
  }

  organisation.collaborators.push(invite);
  await organisation.save();

  res
    .status(200)
    .json({ status: "success", message: "Invite successfully sent" });
});

module.exports.respondToInvite = catchAsync(async (req, res) => {
  const { accept, token } = req.body;

  if (!token) return res.status(400).json({ error: "Token is required" });
  if (accept === undefined)
    return res.status(400).json({ error: "Accept parameter is required" });

  // Find organisation and match the invite by token and expiry
  const organisation = await Organisation.findOne({
    "collaborators.token": token,
    "collaborators.expiresAt": { $gt: new Date() },
  });

  if (!organisation)
    return res.status(404).json({ error: "Invite not found or has expired" });

  const collaboratorIndex = organisation.collaborators.findIndex(
    (c) => c.token === token
  );
  const collaborator = organisation.collaborators[collaboratorIndex];

  const user = await User.findOne({ email: collaborator.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (accept) {
    // Accept invite
    organisation.collaborators[collaboratorIndex].status = "accepted";
    organisation.collaborators[collaboratorIndex].userId = user._id;

    // save organisation id in user
    user.organisationId = organisation._id;
    await user.save();

    await organisation.save();
    return res.status(200).json({ message: "Invite accepted successfully" });
  } else {
    // Decline invite
    organisation.collaborators.splice(collaboratorIndex, 1); // Remove invite
    await organisation.save();
    return res.status(200).json({ message: "Invite declined" });
  }
});

module.exports.getCollaborators = catchAsync(async (req, res) => {
  const organisationId = req.params.id;
  console.log(organisationId);
  console.log("getting collaborators");

  const organisation = await Organisation.findById(organisationId).select(
    "collaborators"
  );
  console.log(organisation);
  if (!organisation)
    throw new AppError("No organisation found with this ID", 404);
  return sendSuccessResponseData(
    res,
    "collaborators",
    organisation.collaborators
  );
});

module.exports.deleteCollaborator = catchAsync(async (req, res) => {
  const organisationId = req.params.id;
  const collaboratorId = req.params.collaboratorId;

  console.log(
    "this is organisation controller",
    organisationId,
    collaboratorId,
    "this is organisation controller"
  );

  //delete collaborator by their collaboratorId

  if (!collaboratorId) throw new AppError("Collaborator ID is required", 400);

  const organisation = await Organisation.findById(organisationId);

  if (!organisation)
    throw new AppError("No organisation found with this ID", 404);

  console.log(organisation.collaborators, "organisation.collaborators");
  const collaboratorIndex = organisation.collaborators.findIndex(
    (collaborator) => collaborator._id.toString() === collaboratorId.toString()
  );

  console.log(collaboratorIndex, "collaboratorIndex");

  if (collaboratorIndex === -1)
    throw new AppError("Collaborator not found", 404);

  await User.updateOne(
    { email: organisation.collaborators[collaboratorIndex].email },
    { $set: { organisationId: null } }
  );
  organisation.collaborators.splice(collaboratorIndex, 1);
  await organisation.save();

  res.status(200).json({ status: "success", message: "Collaborator removed" });
});

// Remove organisationId from users
module.exports.removeorganisationIdFromUsers = catchAsync(async (req, res) => {
  const { organisationId } = req.params; // The organisationId can come from params, query, or body depending on your setup

  // Update all users that have this organisationId
  const result = await User.updateMany(
    { organisationId: organisationId },
    { $set: { organisationId: null } }
  );

  if (result.nModified === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No users found for this organisation.",
    });
  }

  res.status(200).json({
    status: "success",
    message: `organisation ${organisationId} removed from users.`,
  });
});

// Link organisationId to users
module.exports.linkOrganisationIdToUsers = catchAsync(async (req, res) => {
  const { organisationId } = req.body; // The organisationId can come from the body of the request

  // Find the organisation (to check if it's valid)
  const organisation = await Organisation.findById(organisationId);
  if (!organisation) {
    return res
      .status(404)
      .json({ status: "fail", message: "organisation not found." });
  }

  // Add the organisationId back to all users
  const result = await User.updateMany(
    { organisationId: { $ne: organisationId } }, // Ensure the organisationId is not already set
    { $set: { organisationId: organisationId } } // Re-link the organisationId to users
  );

  if (result.nModified === 0) {
    return res.status(400).json({
      status: "fail",
      message: "No users found to link to this organisation.",
    });
  }

  res.status(200).json({
    status: "success",
    message: `organisation ${organisationId} re-linked to users.`,
  });
});
