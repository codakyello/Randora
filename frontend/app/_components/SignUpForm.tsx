"use client";
import { FormEvent, useState } from "react";
import FormRow from "./FormRow";
import Input from "./Input";
import { signUp } from "../_lib/data-service";
import Button from "./Button";
import { Box } from "@chakra-ui/react";
import { showToastMessage } from "@/app/_utils/utils";

function SignUpForm({
  setEmail,
  setStep,
}: {
  setEmail: (email: string) => void;
  setStep: (step: number) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const res = await signUp(formData);

    showToastMessage(res.status, res.message, "User created successfully");
    if (res.status !== "error") {
      setEmail(email);
      setStep(2);
    }
    setLoading(false);
  }
  return (
    <Box className="flex flex-col p-5 bg-[var(--color-grey-50)] h-screen items-center justify-center">
      <h1 className="mb-10">Randora</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem]"
      >
        <h2 className="mb-[1.8rem]">Create your account</h2>

        <FormRow label="Username" htmlFor="my-username">
          <Input required={true} type="text" name="userName" id="my-fullName" />
        </FormRow>

        <FormRow label="Email address" htmlFor="my-email">
          <Input required={true} type="email" name="email" id="my-email" />
        </FormRow>

        <FormRow label="Password (min 8 characters)" htmlFor="my-password">
          <Input
            required={true}
            type="password"
            name="password"
            id="my-password"
          />
        </FormRow>

        <FormRow label="Repeat password" htmlFor="confirm-password">
          <Input
            required={true}
            type="password"
            name="confirmPassword"
            id="confirm-password"
          />
        </FormRow>

        <div className=" flex gap-5 mt-[2rem]">
          <Button
            action="submit"
            className="w-full h-[5.2rem]"
            loading={loading}
            type="primary"
          >
            <p className="text-[1.6rem]">Get Started</p>
          </Button>
        </div>

        {/* <p className="mt-[1rem] text-center">
          Have an account?{" "}
          <Link href={"/login"} className="font-semibold">
            Login
          </Link>
        </p> */}
      </form>
    </Box>
  );
}

export default SignUpForm;
