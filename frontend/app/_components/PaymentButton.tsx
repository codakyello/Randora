// In your component file
"use client";

declare global {
  interface Window {
    Juicyway: {
      PayWithJuice: (options: {
        onClose: () => void;
        onSuccess: () => void;
        onError: (error: unknown) => void;
        reference: string;
        amount: number;
        currency: string;
        description: string;
        isLive: boolean;
        appName: string;
        paymentMethod: {
          type: "bank_account" | "card" | "interac" | "crypto_address";
        };
        customerId: string;
        key: string;
        order: {
          identifier: string;
          items: {
            name: string;
            type: string;
            qty?: number;
            amount?: number;
          }[];
        };
        metadata?: object;
      }) => void;
    };
  }
}

import { useEffect, useState } from "react";
import Button from "./Button";

const PaymentButton = () => {
  const [isJuicywayLoaded, setIsJuicywayLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Juicyway) {
      setIsJuicywayLoaded(true);
    }
  }, []);

  const handlePayment = () => {
    if (!isJuicywayLoaded) {
      console.error("Juicyway SDK not loaded.");
      return;
    }

    // create a transaction
    // get a unique transaction reference

    window.Juicyway.PayWithJuice({
      onClose: () => {
        console.log("Payment widget closed.");
      },
      onSuccess: () => {
        alert("Payment successful!");
        // show success message
        console.log("Payment successful!");
      },
      onError: (error: unknown) => console.error("Payment failed:", error),
      reference: "bank_transfer_4",
      // Generate a unique reference
      amount: 20000,
      currency: "NGN",
      description: "Randora Subscription",
      isLive: true,
      appName: "Randora",
      paymentMethod: {
        type: "bank_account",
      },
      customerId: "27930b96-96aa-40c6-b058-b0f27700dc66",
      key: "live_Z2F0ZXdheS1saXZlOmQ2MDg2ZTBhLTgzMjQtNGNlMy1iOWEzLTQ5ODIzMWJiMjA0NTpmYWYwYTExNS0wZjg1LTQxZWItYjNkYy02MjlmOGJkMzJiZTA", // Add the key property
      order: {
        identifier: "order_1234556",
        items: [
          {
            name: "E-book",
            type: "digital",
            qty: 1,
            amount: 1000,
          },
        ],
      },
      metadata: {
        customField: "custom_value",
      },
    });
  };

  return (
    <Button type="primary" onClick={handlePayment}>
      Pay Now
    </Button>
  );
};

export default PaymentButton;
