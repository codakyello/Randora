"use client";
import { FormEvent, useState } from "react";
import Button from "./Button";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import { Box } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { updateOrganisation, updateUser } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { Organisation, User } from "../_utils/types";
import { showToastMessage } from "../_utils/utils";
import { useUploadFile } from "../_hooks/useUploadFile";

export default function UpdateAccountForm({
  user,
  organisation,
}: {
  user: User;
  organisation: Organisation;
}) {
  const { getToken, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { uploadFile } = useUploadFile();

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

    setLoading(true);

    // Start image uploading
    if (avatarFile instanceof File) {
      if (avatarFile.name) {
        try {
          const fileFormData = new FormData();
          fileFormData.append("file", avatarFile);
          const response = await uploadFile(fileFormData);
          const url = response.data?.data.ufsUrl;

          if (!response.success) {
            toast.error(
              (response.message as string) || "Failed to upload avatar image"
            );
          } else if (response.data && url) {
            formInputs.image = url;
            // toast.success("Text logo uploaded successfully");
          }
        } catch (error) {
          toast.error("Failed to upload text logo");
          console.error("Failed to upload text logo:", error);
        }
      }
    }

    const [user, res2] = await Promise.all([
      updateUser(formInputs),
      organisation &&
        updateOrganisation({ name: organisationName }, organisation._id),
    ]);

    if (user?.status !== "error") {
      login(user, token);
    }

    showToastMessage(
      user?.status || res2?.status,
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
