const cron = require("node-cron");
const Organisation = require("../models/organisationModel");
const User = require("../models/userModel");

// Cleanup function to remove organisation ID from users in expired organisation
const removeOrganisationFromUsers = async (organisationId) => {
  try {
    await User.updateMany(
      { organisationId },
      { $unset: { organisationId: "" } }
    );
    console.log(
      `Removed organisationId from all users in organisation ${organisationId}`
    );
  } catch (err) {
    console.error("Error removing organisationId from users:", err);
  }
};

// Cron job to run every day and check for expired subscriptions
cron.schedule("0 0 * * *", async () => {
  // Runs every day at midnight
  try {
    const expiredOrganisations = await Organisation.find({
      subscriptionExpiresAt: { $lt: new Date() }, // Expired subscriptions
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
