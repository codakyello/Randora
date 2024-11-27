"use client";
import { FormEvent, useState } from "react";
import FormRow from "./FormRow";
import Input from "./Input";
import { signUp } from "../_lib/data-service";
import Button from "./Button";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../_contexts/AuthProvider";
import {
  useHandleUnAuthorisedResponse,
  showToastMessage,
} from "@/app/_utils/utils";

function SignUpForm() {
  const { getToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const token = getToken();
    if (!token) return;
    const res = await signUp(formData, token);

    handleUnAuthorisedResponse(res.statusCode);
    showToastMessage(res.status, res.message, "User created successfully");
    setLoading(false);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] text-[1.4rem] rounded-[var(--border-radius-md)]"
    >
      <FormRow orientation="horizontal" label="Full name" htmlFor="my-fullName">
        <Input required={true} type="text" name="fullName" id="my-fullName" />
      </FormRow>

      <FormRow
        orientation="horizontal"
        label="Email address"
        htmlFor="my-email"
      >
        <Input required={true} type="email" name="email" id="my-email" />
      </FormRow>

      <FormRow
        orientation="horizontal"
        label="Password (min 8 characters)"
        htmlFor="my-password"
      >
        <Input
          required={true}
          type="password"
          name="password"
          id="my-password"
        />
      </FormRow>

      <FormRow
        orientation="horizontal"
        label="Repeat password"
        htmlFor="confirm-password"
      >
        <Input
          required={true}
          type="password"
          name="confirmPassword"
          id="confirm-password"
        />
      </FormRow>

      {user?.isRoot ? (
        <Box className="flex items-center gap-4 py-[1.5rem]">
          <Input name="isRoot" id="isRoot" type="checkbox" />
          <label htmlFor="isRoot" className="font-medium">
            Make root admin?
          </label>
        </Box>
      ) : (
        ""
      )}

      <div className=" flex gap-5 mt-5 justify-end">
        <Button type="cancel">Cancel</Button>
        <Button action="submit" loading={loading} type="primary">
          Create new user
        </Button>
      </div>
    </form>
  );
}

export default SignUpForm;
