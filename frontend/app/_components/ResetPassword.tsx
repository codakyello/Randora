"use client";
import FormRow from "@/app/_components/FormRow";
import Input from "@/app/_components/Input";
import { FormEvent, useState } from "react";
import { resetPassword } from "@/app/_lib/data-service";
import SpinnerMini from "@/app/_components/SpinnerMini";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../_contexts/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function ResetPassword({ token }: { token: string }) {
  console.log("token", token);

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { login, setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const confirmPassword = formData.get("confirmPassword") as string;
    const password = formData.get("password") as string;

    if (!confirmPassword || !password) return;

    setLoading(true);

    const res = await resetPassword({ password, confirmPassword, token });

    if (res.status !== "error") {
      login(res.user);
      setToken(res.token);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  }
  return (
    <Box className="flex flex-col gap-10 p-5 bg-[var(--color-grey-50)] h-screen items-center justify-center">
      <h1>Randora</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem]"
      >
        <h2 className="mb-[1.8rem]">Reset your password</h2>
        <Box className="flex flex-col">
          <FormRow label="New Password" htmlFor="new-password">
            <div className="relative">
              <Input
                required={true}
                className="w-full"
                name="password"
                type={showPassword ? "text" : "password"}
                id="new-password"
              />

              <button
                type="button"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
                className="absolute top-[1.5rem] right-5"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </FormRow>
          <FormRow label="Confirm Password" htmlFor="confirm-password">
            <div className="relative">
              <Input
                required={true}
                className="w-full"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
              />

              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword((prev) => !prev);
                }}
                className="absolute top-[1.5rem] right-5"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </FormRow>
        </Box>

        <div className="flex flex-col gap-[.8rem] my-[1.2rem]">
          <button
            type="submit"
            className="h-[5.2rem]  flex justify-center  items-center py-[1.2rem] px-[1.6rem] bg-[var(--color-brand-600)] rounded-md text-white"
          >
            {loading ? <SpinnerMini /> : "Reset"}
          </button>
        </div>
      </form>
    </Box>
  );
}

export default ResetPassword;
