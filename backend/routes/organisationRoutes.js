// routes for organisation
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const organisationController = require("../controllers/organisationController");

router
  .route("/:id/collaborators")
  .get(
    authController.authenticate,
    authController.authorize("user"),
    organisationController.getCollaborators
  );

// delete collaborator
router
  .route("/:id/collaborators/:collaboratorId")
  .delete(
    authController.authenticate,
    authController.authorize("user"),
    organisationController.deleteCollaborator
  );

// send invite
router
  .route("/:id/collaborators/invite")
  .post(
    authController.authenticate,
    authController.authorize("user"),
    organisationController.sendInvite
  );

// respond to invite
router
  .route("/:id/collaborators/respond")
  .post(organisationController.respondToInvite);

// validate invite
router
  .route("/:id/collaborators/invite")
  .get(organisationController.validateInvite);

module.exports = router;
