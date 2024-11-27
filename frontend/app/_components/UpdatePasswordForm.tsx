"use client";
import { Box } from "@chakra-ui/react";
import Button from "./Button";
import FormRow from "./FormRow";
import Input from "./Input";
import { FormEvent, useState } from "react";
import { updatePassword } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import {
  useHandleUnAuthorisedResponse,
  showToastMessage,
} from "@/app/_utils/utils";

export default function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const { getToken, setToken } = useAuth();
  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const formFields = Object.fromEntries(formData) as {
      currPassword: FormDataEntryValue;
      password: FormDataEntryValue;
      confirmPassword: FormDataEntryValue;
    };

    const token = getToken();

    if (!token) return;

    setLoading(true);

    const res = await updatePassword(formFields, token);
    if (res.status !== "error") {
      // save token in localstorage

      setToken(res.token);
    }

    setLoading(false);

    handleUnAuthorisedResponse(res?.statusCode);

    console.log(res.message);
    showToastMessage(
      res?.status,
      res?.message,
      "Password updated successfully"
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] text-[1.4rem] rounded-[var(--border-radius-md)]"
    >
      <FormRow
        orientation="horizontal"
        label="Current Password"
        htmlFor="my-currPassword"
      >
        <Input
          required={true}
          type="password"
          name="currPassword"
          id="my-currPassword"
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Password" htmlFor="my-password">
        <Input
          required={true}
          type="password"
          name="password"
          id="my-password"
        />
      </FormRow>

      <FormRow
        orientation="horizontal"
        label="Confirm Password"
        htmlFor="my-confirmPassword"
      >
        <Input
          required={true}
          type="password"
          name="confirmPassword"
          id="my-confirmPassword"
        />
      </FormRow>

      <Box className=" flex gap-5 mt-5 justify-end">
        <Button type="cancel">Cancel</Button>
        <Button action="submit" loading={loading} type="primary">
          Update Password
        </Button>
      </Box>
    </form>
  );
}
