const cron = require("node-cron");
const Organisation = require("../models/organisationModel");
const User = require("../models/userModel");

// Renewal function to update the subscription and re-link the orgId
const renewSubscription = async (organisationId, newExpirationDate) => {
  try {
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) throw new Error("Organisation not found");

    organisation.subscriptionExpiresAt = newExpirationDate;
    organisation.subscriptionStatus = "active"; // Set as active after payment

    await organisation.save();

    // Re-link organisationId to users who have it unset
    await User.updateMany(
      { organisationId: null },
      { $set: { organisationId: organisation._id } }
    );
    console.log(
      `Subscription for Organisation ${organisationId} renewed and users re-linked.`
    );
  } catch (err) {
    console.error("Error renewing subscription:", err);
  }
};

// Example usage of renewing subscription (this can be triggered on payment completion)
cron.schedule("0 0 * * *", async () => {
  // For testing purpose, can be triggered upon payment

  try {
    const organisationId = "someOrgId"; // Example ID
    const newExpirationDate = new Date();
    newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
    await renewSubscription(organisationId, newExpirationDate);
  } catch (err) {
    console.error("Error renewing subscription:", err);
  }
});
