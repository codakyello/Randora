const cron = require("node-cron");
const Organisation = require("../models/organisationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Email = require("../utils/email");

// Cleanup function to remove organisation ID from users in expired organisation
const removeOrganisationFromUsers = async (organisationId) => {
  // update only individual accounts
  try {
    await User.updateMany(
      { organisationId, accountType: "individual" },
      { $unset: { organisationId: "" } }
    );
    console.log(
      `Removed organisationId from all users in organisation ${organisationId}`
    );

    // send email to owner
    const organisation = await Organisation.findById(organisationId);

    organisation.subscriptionStatus = "expired";
    await organisation.save();
    const owner = await User.findById(organisation.owner);
    if (owner) {
      await new Email(owner).sendSubscriptionExpiry(organisation.name);
    }
  } catch (err) {
    console.error("Error removing organisationId from users:", err);
  }
};

// Helper function to check DB connection
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Cron job to run every day and check for expired subscriptions
cron.schedule("0 0 * * *", async () => {
  // Runs every day at midnight
  try {
    if (!isDatabaseConnected()) {
      console.log("Database not connected. Skipping subscription cleanup.");
      return;
    }

    const expiredOrganisations = await Organisation.find({
      subscriptionExpiryDate: { $lt: new Date() }, // Expired subscriptions
      subscriptionStatus: "active",
    });
    for (const organisation of expiredOrganisations) {
      // Remove the organisationId from all users linked to the expired organisation
      await removeOrganisationFromUsers(organisation._id);
      console.log(
        `Organisation ${organisation._id} expired and users' orgId removed.`
      );
    }
  } catch (err) {
    console.error("Error checking for expired subscriptions:", err);
  }
});
