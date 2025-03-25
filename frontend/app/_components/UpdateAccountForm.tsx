"use client";
import { FormEvent, useState } from "react";
import Button from "./Button";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import { Box } from "@chakra-ui/react";
import supabase from "@/app/supabase";
import toast from "react-hot-toast";
import { updateOrganisation, updateUser } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { Organisation, User } from "../_utils/types";
import { showToastMessage } from "../_utils/utils";

export default function UpdateAccountForm({
  user,
  organisation,
}: {
  user: User;
  organisation: Organisation;
}) {
  const { getToken, login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const avatarFile = formData.get("image");
    const email = formData.get("email") as string;
    const userName = formData.get("userName") as string;
    const organisationName = formData.get("organisationName") as string;

    const formInputs: {
      email: string;
      userName: string;
      image?: string;
    } = {
      email: email || "",
      userName: userName || "",
    };

    const token = getToken();
    if (!token) return;

    // Start image uploading
    setLoading(true);
    if (avatarFile instanceof File) {
      const fileName = `${avatarFile.name}-${Date.now()}`;

      if (avatarFile.name) {
        try {
          const { data, error } = await supabase.storage
            .from("avatars")
            .upload(`public/${fileName}`, avatarFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            throw new Error(error.message);
          } else {
            formInputs.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Failed to upload avatar");
          }
        }
      }
    }

    const [res, res2] = await Promise.all([
      updateUser(formInputs),
      organisation &&
        updateOrganisation({ name: organisationName }, organisation._id),
    ]);

    if (res?.status !== "error") {
      login(res.user, token);
    }

    showToastMessage(
      res?.status || res2?.status,
      "Failed to update profile",
      "Profile updated successfully"
    );

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
          defaultValue={user?.email}
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Username" htmlFor="my-username">
        <Input
          required={true}
          type="text"
          name="userName"
          id="my-username"
          defaultValue={user?.userName}
        />
      </FormRow>

      {organisation && (
        <FormRow
          orientation="horizontal"
          label="Organisation name"
          htmlFor="my-organisation-name"
        >
          <Input
            required={true}
            type="text"
            name="organisationName"
            id="my-organisation-name"
            defaultValue={organisation?.name}
          />
        </FormRow>
      )}

      <FormRow orientation="horizontal" label="Avatar image" htmlFor="my-image">
        <FileInput
          required={false}
          accept="image/*"
          name={"image"}
          id="my-image"
          loading={loading}
        />
      </FormRow>

      <Box className=" flex gap-5 mt-5 justify-end">
        <Button type="cancel">Cancel</Button>
        <Button
          className="h-[4.6rem] w-[15.5rem]"
          action="submit"
          loading={loading}
          type="primary"
        >
          Update account
        </Button>
      </Box>
    </form>
  );
}
