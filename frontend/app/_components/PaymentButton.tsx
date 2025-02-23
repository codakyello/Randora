// In your component file
"use client";

declare global {
  interface Window {
    Juicyway: {
      PayWithJuice: (options: {
        onClose: () => void;
        onSuccess: (t: unknown) => void;
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
        key: string | undefined;
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
  };

  return (
    <Button type="primary" onClick={handlePayment}>
      Pay Now
    </Button>
  );
};

export default PaymentButton;
