"use client";
import { Box } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "./Button";
import Input from "./Input";
import { useState } from "react";
import SpinnerMini from "./SpinnerMini";
import { forgotPassword } from "../_lib/data-service";
import { showToastMessage } from "../_utils/utils";

export default function ForgotPassword({ onClose }: { onClose?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async function () {
    if (!email) return;

    setLoading(true);

    const res = await forgotPassword(email);

    showToastMessage(res.status, res.message, res.message);

    setLoading(false);

    onClose?.();
  };

  return (
    <Box className="max-w-[45rem] flex flex-col gap-[1.2rem] px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)]">
      <Box className="flex items-center mb-[2rem] justify-between">
        <h2>Forgot your password?</h2>
        <button onClick={onClose}>
          <IoCloseOutline size="3rem" />
        </button>
      </Box>

      <p className="mb-[1.2rem] ">
        Enter your email address below and we&apos;ll send you a link to reset
        your password.
      </p>

      <form>
        <Input
          onChange={(event) => setEmail(event.currentTarget.value)}
          type="email"
          placeholder="Email"
          required={true}
          className="w-full"
          name="email"
          id="my-email"
        />

        <Button
          onClick={handleSubmit}
          type="primary"
          className="mt-[2rem] text-[1.6rem] w-full  h-[5.2rem]"
        >
          {loading ? <SpinnerMini /> : "Send reset link"}
        </Button>
      </form>
    </Box>
  );
}
