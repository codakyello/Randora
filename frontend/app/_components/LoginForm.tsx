"use client";
import FormRow from "@/app/_components/FormRow";
import Input from "./Input";
import { FormEvent, useState } from "react";
import { login as loginApi } from "../_lib/data-service";
import toast from "react-hot-toast";
import { useAuth } from "../_contexts/AuthProvider";
import SpinnerMini from "@/app/_components/SpinnerMini";
function LoginForm() {
  const { login, setToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const data = await loginApi(formData);

    if (data.status === "error") {
      toast.error(data.message);
    } else {
      login(data.user);
      setToken(data.token);
    }
    setLoading(false);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-stretch flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-[var(--border-radius-md)] text-[1.4rem] w-full max-w-[48rem]"
    >
      <FormRow label="Email address" htmlFor="my-email">
        <Input name="email" type="email" id="my-email" />
      </FormRow>

      <FormRow label="Password" htmlFor="my-password">
        <Input name="password" type="password" id="my-password" />
      </FormRow>

      <div className="flex flex-col gap-[.8rem] my-[1.2rem]">
        <button
          type="submit"
          className="flex justify-center  items-center py-[1.2rem] px-[1.6rem] bg-[var(--color-brand-600)] rounded-md text-white"
        >
          {loading ? <SpinnerMini /> : "Log in"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
