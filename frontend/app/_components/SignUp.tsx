"use client";

import { useState } from "react";
import OTPForm from "@/app/_components/OTPForm";
import SignUpForm from "@/app/_components/SignUpForm";
import AccountType from "./AccountType";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Signup() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  const step = Number(searchParams.get("step")) || 1;

  console.log("step", step);

  const accountType = searchParams.get("accountType") || "individual";

  console.log(accountType);

  // const [accountType, setAccountType] = useState("individual");

  const handleStep = function (step: number) {
    const params = new URLSearchParams(searchParams);
    params.set("step", step + "");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAccountType = function (accountType: string) {
    const params = new URLSearchParams(searchParams);
    params.set("accountType", accountType);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (step === 1)
    return (
      <AccountType
        onStep={handleStep}
        onAccountType={handleAccountType}
        accountType={accountType}
      />
    );

  if (step === 2)
    return (
      <SignUpForm
        accountType={accountType}
        setEmail={setEmail}
        onStep={handleStep}
      />
    );

  if (step === 3)
    return <OTPForm step={step} onStep={handleStep} email={email} />;
}
