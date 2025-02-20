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

  if (isAuthenticating) return null;

  const getStarted = function () {
    // check if the user is logged in first
    if (!authenticated) open("auth");
  };

  return (
    <>
      <Box className="text-center">
        {/* <NavBar user={user} logout={logout} /> */}

        <Box className="flex h-[7rem] items-center justify-between gap-8">
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
                      className="text-white py-[1.5rem] rounded-[10px] w-full bg-[var(--color-primary)]"
                    >
                      Get Started for Free
                    </button>
                  </Link>
                )}

                {plan.name.toLowerCase() !== "free" && (
                  <button
                    onClick={() => {
                      setAccountType("");
                      setAccountType(plan.name.toLowerCase());
                      getStarted();
                    }}
                    disabled={
                      user
                        ? user?.accountType !== plan.name.toLowerCase()
                        : false
                    }
                    className="text-white py-[1.5rem] rounded-[10px] w-full bg-[var(--color-primary)]"
                  >
                    Get Started
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
                setEmail={setEmail}
                setAuthType={setAuthType}
                authType={authType}
                onStep={setStep}
              />
            ) : (
              <LoginForm
                setEmail={setEmail}
                setStep={setStep}
                authType={authType}
                setAuthType={setAuthType}
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

      {/* <ModalWindow name="login">
        <LoginForm />
      </ModalWindow> */}
    </>
  );
}
