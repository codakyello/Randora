"use client";
import { Box } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import Button from "./Button";
import { FormEvent, useState } from "react";
import { updatePrize as updatePrizeApi } from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
import { IoCloseOutline } from "react-icons/io5";
import { Prize, PrizeForm } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import { useParams } from "next/navigation";
import { useMenu } from "./Menu";
import supabase from "../supabase";
import FileInput from "./FileInput";

export default function EditPrizeForm({
  prizeToEdit,
  onClose,
}: {
  prizeToEdit?: Prize;
  onClose?: () => void;
}) {
  const [isUploading, setUploading] = useState(false);
  const { _id: editId, ...editValues } = prizeToEdit ?? ({} as Prize);
  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();
  const token = getToken();

  const params = useParams();

  const eventId = params.eventId as string;
  const { close: closeMenu } = useMenu();

  const { mutate: updatePrize, isPending: isUpdating } =
    useCustomMutation(updatePrizeApi);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const quantity = Number(formData.get("quantity"));
    const prizeFile = formData.get("image");

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
        }

        console.log("image uploaded");
        prizeForm.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
      }
    }
    setUploading(false);

    console.log(prizeForm);

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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">Edit Prize</h2>
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

      <FormRow htmlFor="image" label="Image" orientation="horizontal">
        <FileInput
          accept="image"
          loading={isUploading}
          name="image"
          id="image"
          required={true}
        />
      </FormRow>

      <Box className="flex  justify-end gap-5 mt-5 items-center">
        <Button type="cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="w-[12rem] h-[4.5rem]"
          loading={isUpdating || isUploading}
          type="primary"
          action="submit"
        >
          {!isEditSession ? "Create prize" : "Edit prize"}
        </Button>
      </Box>
    </form>
  );
}
