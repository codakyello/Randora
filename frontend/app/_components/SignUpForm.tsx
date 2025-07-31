/* eslint-disable @next/next/no-img-element */
"use client";
import { FormEvent, useState } from "react";
import FormRow from "./FormRow";
import Input from "./Input";
import {  signUp } from "../_lib/data-service";
import Button from "./Button";
import { Box } from "@chakra-ui/react";
import { showToastMessage } from "@/app/_utils/utils";
import Link from "next/link";
import * as jdenticon from "jdenticon";
import supabase from "../supabase";
import toast from "react-hot-toast";
import router from "next/router";
import { useAuth } from "../_contexts/AuthProvider";

function SignUpForm({
  accountType,
  setAuthType,
  authType,
  onClose,
}: {
  onStep: (step: number) => void;
  accountType: string;
  setAuthType?: React.Dispatch<React.SetStateAction<"login" | "signup">>;
  authType?: string;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  // const { open } = useModal();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const hash =
      email.split("@")[0] + Math.random().toString(36).substring(2, 15);
    const svg = jdenticon.toSvg(hash, 100);

    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/${hash}.svg`, svg, {
          contentType: "image/svg+xml",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      } else {
        console.log("updloaded");

        formData.append(
          "image",
          `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`
        );
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.log(error);
    }

    const res = await signUp(formData, accountType);

    if (res.status !== "error") {
      login(res.data.user, res.token);
      showToastMessage(res.status, res.message, "User created successfully");


      if (window.location.pathname === "/pricing") {
        // close the modal
        onClose?.()
      }
      
      else router.push("/dashboard");
      
    } else {
      if (res.message === "fetch failed")
        toast.error("Bad Internet connection");
      else toast.error(res.message);
    }
    // setStep(2);
    // if (res.status !== "error") {
    //   if (authType) setStep(3);
    //   else setStep(2);
    // }
    setLoading(false);
  }
  return (
    <Box className="flex gap-10 w-screen flex-col p-5 bg-[var(--color-grey-50)] h-screen items-center justify-center">
      <img src="img/logo/randora.svg" alt="logo" />
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem] overflow-y-scroll no-scrollbar"
      >
        <h2 className="mb-[1.8rem]">
          Create your{" "}
          {accountType === "individual" ? "individual " : "organisation "}
          account
        </h2>

        {accountType === "organisation" ? (
          <FormRow
            label="Organisation name (required)"
            htmlFor="my-organisationName"
          >
            <Input
              required={true}
              type="text"
              name="organisationName"
              id="my-organisationName"
            />
          </FormRow>
        ) : null}
        <FormRow label="Username (required)" htmlFor="my-username">
          <Input
            required={true}
            type="text"
            name="userName"
            id="my-username"
            placeholder="Enter your username"
          />
        </FormRow>

        <FormRow label="Email address (required)" htmlFor="my-email">
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
            <p className="text-[1.6rem]">Get started</p>
          </Button>
        </div>

        <p className="mt-[1rem] text-center">
          Have an account?{" "}
          {authType && setAuthType ? (
            <button
              onClick={() => {
                setAuthType("login");
              }}
              className="font-semibold text-[var(--color-primary)]"
            >
              Login
            </button>
          ) : (
            <Link
              href={"/login"}
              className="font-semibold text-[var(--color-primary)]"
            >
              Login
            </Link>
          )}
        </p>
      </form>
    </Box>
  );
}

export default SignUpForm;
