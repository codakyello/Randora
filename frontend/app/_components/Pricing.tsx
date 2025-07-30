/* eslint-disable @next/next/no-img-element */
"use client";

import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { MdOutlineCancel, MdOutlineCheckCircleOutline } from "react-icons/md";
import { useAuth } from "../_contexts/AuthProvider";
import { ModalWindow, useModal } from "./Modal";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import OtpForm from "./OTPForm";
import LoginForm from "./LoginForm";
import { IoCloseOutline } from "react-icons/io5";
import Menus from "./Menu";
import PaymentBox from "./PaymentBox";
import { planType } from "../_utils/types";
import { getOrganisation, getUser } from "../_lib/data-service";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      { included: true, feature: "Up to 3 free events" },
      { included: true, feature: "Only raffel events" },
      { included: true, feature: "Event Analytics" },
      { included: false, feature: "Ai generated prize image" },
      { included: false, feature: "Fully customisable lottery page" },
      { included: false, feature: "Upload of csv files and sanitisation" },
      { included: false, feature: "Adding & managing collaborators" },
    ],
  },

  {
    name: "Individual",
    price: 99,
    features: [
      { included: true, feature: "Unlimited number of events" },
      { included: true, feature: "All event types" },
      { included: true, feature: "Event Analytics" },
      { included: true, feature: "Ai generated prize image" },
      { included: false, feature: "Fully customisable lottery page" },
      { included: true, feature: "Upload of csv files and sanitisation" },
      { included: false, feature: "Adding & managing collaborators" },
    ],
  },

  {
    name: "Organisation",
    price: 199,
    features: [
      { included: true, feature: "Unlimited number of events" },
      { included: true, feature: "All event types" },
      { included: true, feature: "Ai generated prize image" },
      { included: true, feature: "Event Analytics" },
      { included: true, feature: "Fully customisable lottery page" },
      { included: true, feature: "Upload of csv files and sanitisation" },
      { included: true, feature: "Adding & managing collaborators" },
    ],
  },
];

export default function Pricing() {
  const { user, isAuthenticating, authenticated, logout } = useAuth();
  const { open, close } = useModal();
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState(2);
  const [accountType, setAccountType] = useState<string>("");
  const [authType, setAuthType] = useState<"signup" | "login">("signup");
  const [plan, setPlan] = useState<planType | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticating) return null;

  const getStarted = async () => {
    // check if the user is logged in first
    if (!authenticated || !user) return open("auth");
    console.log(user);

    // Begin the payment process
    // open the payment modal
    // Check if a subscription is already ongoing.
    setLoading(true);
    if (user.accountType === "organisation") {
      console.log(user);
      try {
        const organisation = await getOrganisation(user.organisationId);
        if (organisation.subscriptionStatus === "active")
          return toast.error("You still have an active subscription");
      } catch (err: unknown) {
        if (err instanceof Error) {
          return toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const individual = await getUser();

        if (individual.subscriptionStatus === "active")
          return toast.error("You still have an active subscription");
      } catch (err) {
        if (err instanceof Error) {
          return toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    open("payment");
  };

  return (
    <Box className="bg-[var(--color-grey-50)]">
      <Box className="flex h-[7rem] p-[2rem] sm:px-[4rem] items-center justify-between gap-8">
        <Link href={"/"}>
          <img src="img/logo/randora.svg" alt="logo" />
        </Link>

        {user ? (
          <>
            <Menus.Toogle id="userMenu">
              <img
                src={user.image}
                alt="avatar"
                className="w-[4rem] h-[4rem] rounded-full"
              />
            </Menus.Toogle>

            <Menus.Menu id="userMenu">
              <Menus.Button onClick={() => logout?.()}>Sign Out</Menus.Button>
            </Menus.Menu>
          </>
        ) : (
          <Box className="flex gap-8 items-center">
            <Link className="font-medium text-[1.8rem] " href={"/login"}>
              Login
            </Link>

            <Link
              className="font-medium rounded-[8px] px-[2rem] py-[.8rem] border border-[#000] [#000] text-[#000]"
              href={"/signup"}
            >
              Sign Up
            </Link>
          </Box>
        )}
      </Box>

      <Box className="text-center px-[2rem] min-h-screen">
        {/* <NavBar user={user} logout={logout} /> */}

        <h1 className=" tracking-tight mt-[5rem] text-[6rem] leading-[7.2rem] max-w-[80rem] mx-auto mb-[.5rem]">
          Try any of our plans
        </h1>

        <p className="text-[1.6rem] max-w-[60rem] mx-auto mt-[.5rem] mb-[5rem]">
          Pick the plan that fits your account type
        </p>

        <Box className="grid grid-cols-[repeat(auto-fit,_minmax(30rem,_1fr))] gap-[2rem] max-w-[107rem] mx-auto mb-[5rem]">
          {plans.map((plan, index) => (
            <Box
              key={index}
              className="p-[2.4rem] border border-[#333] rounded-[20px] text-center "
            >
              <Box className="flex items-center flex-col gap-[1rem]">
                <h2>{plan.name}</h2>
                <p>
                  <span className="text-[5rem] font-bold">${plan.price}</span>
                  <span className="text-[1.4rem]">/month</span>
                </p>

                {plan.name.toLowerCase() === "free" && (
                  <Link className="w-full" href={`/signup`}>
                    <button
                      disabled={authenticated}
                      className={` py-[1.5rem] rounded-[10px] w-full ${
                        authenticated
                          ? "border border-[#333] text-[#333]"
                          : "text-white bg-[var(--color-primary)]"
                      }`}
                    >
                      Get Started for Free
                    </button>
                  </Link>
                )}

                {plan.name.toLowerCase() !== "free" && (
                  <button
                    onClick={() => {
                      setPlan(plan);
                      setAccountType("");
                      setAccountType(plan.name.toLowerCase());
                      getStarted();
                    }}
                    disabled={
                      user
                        ? user?.accountType !== plan.name.toLowerCase() ||
                          loading
                        : false
                    }
                    className={`py-[1.5rem] rounded-[10px] w-full ${
                      user
                        ? user?.accountType === plan.name.toLowerCase()
                          ? "bg-[var(--color-primary)] text-white"
                          : "border border-[#333] text-[#333]"
                        : "bg-[var(--color-primary)] text-white"
                    } `}
                  >
                    {loading && plan.name.toLowerCase() === accountType ? (
                      <SpinnerMini className="mx-auto" />
                    ) : (
                      "Get Started"
                    )}
                  </button>
                )}

                <Box className="self-start">
                  <p className="text-[#ABABAB] text-start text-[1.3rem] mt-[.8rem] mb-[1.6rem]">
                    Everything included in{" "}
                    <span className="text-[#555]">
                      {plan.name.toLowerCase()}
                    </span>{" "}
                    plan
                  </p>

                  <Box className="flex flex-col text-start gap-[1.2rem]">
                    {plan.features.map(({ feature, included }, index) => (
                      <Box key={index}>
                        <Box className="flex items-center  gap-[1rem]">
                          {included ? (
                            <MdOutlineCheckCircleOutline />
                          ) : (
                            <MdOutlineCancel />
                          )}
                          <span className="text-[1.4rem]">{feature}</span>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <ModalWindow
        listenCapturing={true}
        className="max-w-screen bg-[var(--color-grey-50)]"
        name="auth"
      >
        <>
          <button
            onClick={close}
            className="rounded-[10px] hover:bg-[#5555552d] right-[2rem] top-[2rem] absolute hover:rounded-xl bg-[var(--color-grey-50)] "
          >
            <IoCloseOutline size={"4rem"} />
          </button>
          {step === 2 ? (
            authType === "signup" ? (
              <SignUpForm
                accountType={accountType}
                setAuthType={setAuthType}
                authType={authType}
                onStep={setStep}
                onClose={close}

              />
            ) : (
              <LoginForm
                setEmail={setEmail}
                authType={authType}
                setAuthType={setAuthType}
                onClose={close}

              />
            )
          ) : (
            <OtpForm
              step={step}
              pricingPage={true}
              onStep={setStep}
              email={email}
            />
          )}
        </>
      </ModalWindow>

      <ModalWindow
        name="payment"
        className="max-w-screen bg-[var(--color-grey-50)]"
      >
        <>
          <img
            className="absolute top-[2rem] left-[2rem]"
            src="img/logo/randora.svg"
            alt="logo"
          />

          <button
            onClick={close}
            className="rounded-[10px] hover:bg-[#5555552d] right-[2rem] top-[2rem] absolute hover:rounded-xl bg-[var(--color-grey-50)]"
          >
            <IoCloseOutline size={"4rem"} />
          </button>
          <PaymentBox plan={plan} />
        </>
      </ModalWindow>
    </Box>
  );
}
