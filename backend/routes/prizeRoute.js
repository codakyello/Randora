const express = require("express");
const prizeController = require("../controllers/prizeController");
const { authenticate, authorize } = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authenticate, authorize("admin"), prizeController.getAllPrizes)
  .post(authenticate, authorize("admin", "user"), prizeController.createPrize);

router
  .route("/:id")
  .get(authenticate, authorize("admin", "user"), prizeController.getPrize)
  .patch(authenticate, authorize("admin", "user"), prizeController.updatePrize)
  .delete(
    authenticate,
    authorize("admin", "user"),
    prizeController.deletePrize
  );

module.exports = router;
