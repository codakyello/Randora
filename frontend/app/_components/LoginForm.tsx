"use client";
import FormRow from "@/app/_components/FormRow";
import Input from "./Input";
import { FormEvent, useState } from "react";
import { login as loginApi } from "../_lib/data-service";
import toast from "react-hot-toast";
import SpinnerMini from "@/app/_components/SpinnerMini";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Box } from "@chakra-ui/react";

function LoginForm({
  setEmail,
  setStep,
}: {
  setEmail: (email: string) => void;
  setStep: (step: number) => void;
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

    const data = await loginApi(formData);

    if (data.status !== "error") {
      toast.success(data.message);
      setStep(2);
    } else {
      toast.error(data.message);

      // login(data.user);
      // setToken(data.token);
    }
    setLoading(false);
  }
  return (
    <Box className="flex p-5 bg-[var(--color-grey-50)] gap-[3.2rem] flex-col h-screen items-center justify-center">
      <h1>Log in to your account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem]"
      >
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

        <Link
          href={"#"}
          className="text-end font-semibold mb-2 text-[var(--color-brand-600)]"
        >
          Forgot Password?
        </Link>
        <div className="flex flex-col gap-[.8rem] my-[1.2rem]">
          <button
            type="submit"
            className="h-[5.5rem] flex justify-center  items-center py-[1.2rem] px-[1.6rem] bg-[var(--color-brand-600)] rounded-md text-white"
          >
            {loading ? <SpinnerMini /> : "Login"}
          </button>
        </div>

        <p className="mt-[1rem] text-center">
          Don&apos;t have an account?{" "}
          <Link
            href={"#"}
            className="font-semibold text-[var(--color-brand-600)]"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Box>
  );
}

export default LoginForm;
