/* eslint-disable @next/next/no-img-element */
"use client";
import FormRow from "@/app/_components/FormRow";
import Input from "./Input";
import { FormEvent, useState } from "react";
import { login as loginApi } from "../_lib/data-service";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import { ModalOpen, ModalWindow } from "./Modal";
import ForgotPassword from "./ForgotPassword";
import { showToastMessage } from "../_utils/utils";
import Button from "./Button";

function LoginForm({
  setEmail,
  setStep,
  authType,
  setAuthType,
}: {
  setEmail: (email: string) => void;
  setStep: (step: number) => void;
  authType?: string;
  setAuthType?: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password");

    if (!email || !password) return;

    setLoading(true);
    setEmail(email);

    const res = await loginApi(formData);

    showToastMessage(res.status, res.message, res.message);

    if (res.status !== "error") {
      if (authType) setStep(3);
      else setStep(2);
    }
    setLoading(false);
  }
  return (
    <Box className="flex w-screen flex-col gap-10 p-5 bg-[var(--color-grey-50)] h-screen items-center justify-center">
      <img src="img/logo/randora.svg" alt="logo" />
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem]"
      >
        <h2 className="mb-[1.8rem]">Log in to your account</h2>
        <Box className="flex flex-col">
          <FormRow label="Email address" htmlFor="my-email">
            <Input required={true} name="email" type="email" id="my-email" />
          </FormRow>
          <FormRow label="Password" htmlFor="my-password">
            <div className="relative">
              <Input
                required={true}
                className="w-full"
                name="password"
                type={show ? "text" : "password"}
                id="my-password"
              />

              <button
                type="button"
                onClick={() => {
                  setShow((prev) => !prev);
                }}
                className="absolute top-[1.5rem] right-5"
              >
                {show ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </FormRow>
        </Box>

        <ModalOpen name="forgot-password">
          <button
            type="button"
            className="text-[1.4rem] text-end font-semibold mb-2 "
          >
            Forgot Password?
          </button>
        </ModalOpen>

        <ModalWindow name="forgot-password">
          <ForgotPassword />
        </ModalWindow>

        <div className="flex flex-col gap-[.8rem] my-[1.2rem]">
          <Button
            action="submit"
            className="w-full h-[5.2rem]"
            loading={loading}
            type="primary"
          >
            <p className="text-[1.6rem]">Login</p>
          </Button>
        </div>

        <p className="mt-[1rem] text-center">
          Don&apos;t have an account?{" "}
          {authType && setAuthType ? (
            <button
              className="font-semibold"
              onClick={() => {
                setAuthType("signup");
              }}
            >
              Signup
            </button>
          ) : (
            <Link href={"/signup"} className="font-semibold ">
              Signup
            </Link>
          )}
        </p>
      </form>
    </Box>
  );
}

export default LoginForm;
