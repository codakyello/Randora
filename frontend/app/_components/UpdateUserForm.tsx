"use client";
import { FormEvent, useState } from "react";
import Button from "./Button";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import { Box } from "@chakra-ui/react";
import supabase from "@/app/supabase";
import toast from "react-hot-toast";
import { updateAdmin } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import {
  useHandleUnAuthorisedResponse,
  showToastMessage,
} from "@/app/_utils/utils";

export default function UpdateUserForm({
  user,
}: {
  user: { email: string; name: string };
}) {
  const { getToken, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();
  const { name, email } = user;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const avatarFile = formData.get("image");
    const email = formData.get("email");
    const name = formData.get("name");

    const formInputs: {
      email: FormDataEntryValue;
      name: FormDataEntryValue;
      image?: string;
    } = {
      email: email || "",
      name: name || "",
    };

    const token = getToken();
    if (!token) return;

    // Start image uploading
    setLoading(true);
    if (avatarFile instanceof File) {
      const fileName = `${avatarFile.name}-${Date.now()}`;

      if (avatarFile.name) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`public/${fileName}`, avatarFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error("Image could not be uploaded");
        } else {
          formInputs.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
        }
      }
    }

    // Update Admin
    const res = await updateAdmin(token, formInputs);
    if (res?.status !== "error") {
      login(res);
    }

    handleUnAuthorisedResponse(res?.statusCode);

    showToastMessage(res?.status, res?.message, "Profile updated successfully");

    setLoading(false);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] text-[1.4rem] rounded-[var(--border-radius-md)]"
    >
      <FormRow
        orientation="horizontal"
        label="Email address"
        htmlFor="my-email"
      >
        <Input
          disabled={true}
          required={true}
          type="email"
          name="email"
          id="my-email"
          defaultValue={email}
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Full name" htmlFor="my-fullName">
        <Input
          required={true}
          type="text"
          name="name"
          id="my-fullName"
          defaultValue={name}
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Avatar image" htmlFor="my-image">
        <FileInput loading={loading} />
      </FormRow>

      <Box className=" flex gap-5 mt-5 justify-end">
        <Button type="cancel">Cancel</Button>
        <Button action="submit" loading={loading} type="primary">
          Update account
        </Button>
      </Box>
    </form>
  );
}
