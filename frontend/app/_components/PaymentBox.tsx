import { Box } from "@chakra-ui/react";
import Button from "./Button";
import { planType } from "../_utils/types";
import Script from "next/script";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { convertCurrency, createTransaction } from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PaymentBox({ plan }: { plan: planType | null }) {
  const [isJuicywayLoaded, setIsJuicywayLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkJuicyway = () => {
      if (typeof window !== "undefined" && window.Juicyway) {
        setIsJuicywayLoaded(true);
      }
    };

    checkJuicyway();
    const interval = setInterval(checkJuicyway, 500);
    return () => clearInterval(interval);
  }, []);

  // simulate a delay
  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 1000);
  }, []);

  async function handlePayment() {
    if (!plan) return;

    setIsLoading(true);

    const amount = await convertCurrency({
      amount: plan.price,
      from: "USD",
      to: "NGN",
    });

    try {
      if (!user) return;

      const transaction = await createTransaction(getToken(), {
        userId: user._id,
        currency: "NGN",
        amount,
        paymentMethod: "crypto",
        paymentFor: plan.name,
      });
      if (isJuicywayLoaded)
        window.Juicyway.PayWithJuice({
          onClose: () => {
            console.log("Payment widget closed.");
            // redirect("/dashboard");
            router.push("/dashboard");
          },
          onSuccess: (t) => {
            alert("Payment successful!");
            // show success message
            console.log("Payment successful!", t);
            router.push("/dashboard");
          },
          onError: (error: unknown) => console.error("Payment failed:", error),
          reference: transaction.reference,
          amount: transaction.amount * 100,
          // Generate a unique reference
          currency: transaction.currency,
          description: "Randora Subscription",
          isLive: true,
          appName: "Randora",
          paymentMethod: {
            type: "bank_account",
          },
          customerId: "27930b96-96aa-40c6-b058-b0f27700dc66",
          key: process.env.NEXT_PUBLIC_JUICYWAY_KEY, // Add the key property

          order: {
            identifier: transaction.reference,
            items: [
              {
                name: plan.name,
                type: "digital",
                qty: 1,
                amount: transaction.amount * 100,
              },
            ],
          },
          metadata: {
            customField: "custom_value",
          },
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error);
      } else {
        console.log("Unknown error:", error);
      }
    } finally {
      setIsLoading(false);
    }

    // convert the dollar to naira
    // create a transaction in my backend
    // use the transaction reference to make payment with juicyway
  }

  return (
    <>
      <Script
        src="https://checkout.juicyway.com/pay.js"
        strategy="lazyOnload"
      />
      {!ready ? (
        <Spinner />
      ) : (
        <Box className="max-w-[47rem] rounded-[15px] w-full pt-[8px] pb-[32px] px-[32px] shadow-[0_4px_16px_0_#ebebeb,0_0_2px_0_#ebebeb]">
          <Box className="flex justify-between py-[1.6rem] text-[#0f0f0f] border-b border-[#ebebeb]">
            <p>{plan && plan.name} Plan</p>
            <p>${plan && plan.price.toFixed(2)}</p>
          </Box>

          <Box className="flex justify-between py-[1.6rem] text-[1.8rem]">
            <Box>
              <p className="text-[1.8rem]">Total</p>
              <p className="text-[1.4rem] text-[#707070]">Billed monthly</p>
            </Box>
            <p className="text-[1.8rem] font-semibold">
              US ${plan && plan.price.toFixed(2)}
            </p>
          </Box>

          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={handlePayment}
            className="w-full h-[5.5rem] mt-[1.6rem]"
            type="primary"
          >
            Pay Now
          </Button>
        </Box>
      )}
    </>
  );
}
