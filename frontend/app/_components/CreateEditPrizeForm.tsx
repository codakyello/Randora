"use client";
import { Box } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import Button from "./Button";
import { FormEvent, useState } from "react";
import {
  createPrize as createPrizeApi,
  updatePrize as updatePrizeApi,
} from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
import supabase from "../supabase";
import { IoCloseOutline } from "react-icons/io5";
import { Prize, PrizeForm } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import { useParams } from "next/navigation";
import { useMenu } from "./Menu";

export default function CreateEditPrizeForm({
  prizeToEdit,
  onClose,
}: {
  prizeToEdit?: Prize;
  onClose?: () => void;
}) {
  const { _id: editId, ...editValues } = prizeToEdit ?? ({} as Prize);
  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();
  const token = getToken();

  const params = useParams();

  const eventId = params.eventId as string;
  const { close: closeMenu } = useMenu();
  const [uploading, setUploading] = useState(false);

  const { mutate: createPrize, isPending: isCreating } =
    useCustomMutation(createPrizeApi);

  const { mutate: updatePrize, isPending: isUpdating } =
    useCustomMutation(updatePrizeApi);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const quantity = Number(formData.get("quantity"));
    const prizeFile = formData.get("image") as File;

    const prizeForm: PrizeForm = {
      name,
      quantity,
      eventId,
    };

    if (prizeFile instanceof File) {
      const fileName = `${prizeFile.name}-${Date.now()}`;

      if (prizeFile.name) {
        setUploading(true);

        const { data, error } = await supabase.storage
          .from("cabin-images")
          .upload(`public/${fileName}`, prizeFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error("Prize image could not be uploaded");
          return;
        } else {
          prizeForm.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
        }
      }
    }
    setUploading(false);

    if (isEditSession) {
      updatePrize(
        { prizeId: editId, prizeForm, token },
        {
          onSuccess: () => {
            toast.success("Prize updated successfully");
            onClose?.();
            closeMenu();
          },
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );
    } else {
      createPrize(
        { prizeForm, token },
        {
          onSuccess: () => {
            toast.success("Prize created successfully");
            onClose?.();
          },
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">{isEditSession ? "Edit" : "Create"} Prize</h2>
        <button onClick={onClose}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <FormRow htmlFor="name" label="Name" orientation="horizontal">
        <Input
          defaultValue={editValues?.name}
          name="name"
          id="name"
          required={true}
          type="text"
        />
      </FormRow>

      <FormRow
        htmlFor="prize_quantity"
        label="Quantity"
        orientation="horizontal"
      >
        <Input
          defaultValue={editValues?.quantity}
          name="quantity"
          id="prize_quantity"
          required={true}
          type="number"
        />
      </FormRow>

      <FormRow
        orientation="horizontal"
        label="Prize Image"
        htmlFor="prize_image"
      >
        <FileInput
          required={isEditSession !== true}
          name="image"
          id="prize_image"
          accept="image/*"
          loading={false}
        />
      </FormRow>

      <Box className="flex  justify-end gap-5 mt-5 items-center">
        <Button type="cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="w-[12rem] h-[4.5rem]"
          loading={isCreating || isUpdating || uploading}
          type="primary"
          action="submit"
        >
          {!isEditSession ? "Create prize" : "Edit prize"}
        </Button>
      </Box>
    </form>
  );
}
