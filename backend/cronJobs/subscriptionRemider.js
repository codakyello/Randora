const cron = require("node-cron");
const Organisation = require("../models/organisationModel");
const User = require("../models/userModel");
const Email = require("../utils/email");

// Reminder 7 days before subscription expiry

cron.schedule("0 0 * * *", async () => {
  // Runs every day at midnight
  try {
    const organisations = await Organisation.find({
      subscriptionExpiresAt: {
        $lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      subscriptionStatus: "active",
    });

    for (const organisation of organisations) {
      const owner = await User.findById(organisation.owner);
      if (owner) {
        // Calculate the number of days remaining
        const daysRemaining = Math.ceil(
          (organisation.subscriptionExpiresAt - new Date()) /
            (1000 * 60 * 60 * 24)
        );

        // Send the reminder email with the exact number of days remaining
        const email = new Email(owner);
        await email.sendSubscriptionReminder(organisation.name, daysRemaining);
      }
    }
  } catch (error) {
    console.error("Error sending subscription reminders:", error);
  }
});
