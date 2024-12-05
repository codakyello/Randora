"use client";

import { useState } from "react";
import OTPForm from "@/app/_components/OTPForm";
import SignUpForm from "@/app/_components/SignUpForm";
import AccountType from "./AccountType";

export default function Signup() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  const [accountType, setAccountType] = useState("individual");

  if (step === 1)
    return (
      <AccountType
        setStep={setStep}
        setAccountType={setAccountType}
        accountType={accountType}
      />
    );

  if (step === 2)
    return (
      <SignUpForm
        accountType={accountType}
        setEmail={setEmail}
        setStep={setStep}
      />
    );

  if (step === 3) return <OTPForm setStep={setStep} email={email} />;
}
