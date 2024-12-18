// const cron = require("node-cron");
// const Organisation = require("../models/organisationModel");
// const mongoose = require("mongoose");

// // Helper function to check DB connection
// const isDatabaseConnected = () => {
//   return mongoose.connection.readyState === 1;
// };

// // Cron job for subscription renewal checks
// cron.schedule("0 0 * * *", async () => {
//   try {
//     if (!isDatabaseConnected()) {
//       console.log(
//         "Database not connected. Skipping subscription renewal checks."
//       );
//       return;
//     }

//     // Your subscription renewal logic here
//     const organisationsToRenew = await Organisation.find({
//       subscriptionExpiryDate: {
//         $gte: new Date(),
//         $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
//       },
//       subscriptionStatus: "active",
//       autoRenew: true,
//     });

//     for (const organisation of organisationsToRenew) {
//       // Add your renewal logic here
//       console.log(`Processing renewal for organisation ${organisation._id}`);
//     }
//   } catch (err) {
//     console.error("Error processing subscription renewals:", err);
//   }
// });

// // Debug cron job
// cron.schedule("*/1 * * * *", async () => {
//   console.log(`Cron job running at ${new Date().toLocaleString()}`);
// });
