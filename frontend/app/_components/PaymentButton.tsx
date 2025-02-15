// // In your component file
// "use client";

// declare global {
//   interface Window {
//     Juicyway: {
//       PayWithJuice: (options: {
//         onClose: () => void;
//         onSuccess: () => void;
//         onError: (error: any) => void;
//         reference: string;
//         amount: number;
//         currency: string;
//         description: string;
//         isLive: boolean;
//         appName: string;
//         customer: {
//           billing_address: {
//             line1: string;
//             city: string;
//             state: string;
//             zip_code: string;
//             country: string;
//           };
//           email: string;
//           first_name: string;
//           last_name: string;
//           phone_number: string;
//         };
//         paymentMethod: {
//           type: string;
//         };
//         customerId: string;
//         key: string;
//         order: {
//           identifier: string;
//           items: {
//             name: string;
//             type: string;
//             qty?: number;
//             amount?: number;
//           }[];
//         };
//         metadata?: object;
//       }) => void;
//     };
//   }
// }

// import { useEffect, useState } from "react";
// import Button from "./Button";

// const PaymentButton = () => {
//   const [isJuicywayLoaded, setIsJuicywayLoaded] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined" && window.Juicyway) {
//       setIsJuicywayLoaded(true);
//     }
//   }, []);

//   const handlePayment = () => {
//     if (!isJuicywayLoaded) {
//       console.error("Juicyway SDK not loaded.");
//       return;
//     }

//     window.Juicyway.PayWithJuice({
//       onClose: () => {
//         console.log("Payment widget closed.");
//       },
//       onSuccess: () => {
//         // show success message
//         console.log("Payment successful!");
//       },
//       onError: (error) => {
//         console.error("Payment failed:", error);
//       },
//       reference: "550e8400-e29b-41d4-a716-446655440000",
//       // Generate a unique reference
//       amount: 1000,
//       currency: "USD",
//       description: "Randora Subscription",
//       isLive: true,
//       appName: "Randora",
//       customer: {
//         billing_address: {
//           line1: "123 Payment St",
//           city: "Lagos",
//           state: "LA",
//           zip_code: "100001",
//           country: "NG",
//         },
//         email: "customer@email.com",
//         first_name: "Test",
//         last_name: "Customer",
//         phone_number: "+2348123456789",
//       },
//       paymentMethod: {
//         type: "card",
//       },
//       customerId: "customer_id_12345", // Add the customerId property
//       key: "live_Z2F0ZXdheS1saXZlOmQ2MDg2ZTBhLTgzMjQtNGNlMy1iOWEzLTQ5ODIzMWJiMjA0NTpmYWYwYTExNS0wZjg1LTQxZWItYjNkYy02MjlmOGJkMzJiZTA", // Add the key property
//       order: {
//         identifier: "order_12345",
//         items: [
//           {
//             name: "E-book",
//             type: "digital",
//             qty: 1,
//             amount: 1000,
//           },
//         ],
//       },
//       metadata: {
//         customField: "custom_value",
//       },
//     });
//   };

//   return (
//     <Button type="primary" onClick={handlePayment}>
//       Pay Now
//     </Button>
//   );
// };

// export default PaymentButton;
