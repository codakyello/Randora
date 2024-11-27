"use client";
import { Box, Textarea } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import Button from "./Button";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { createCabin, updateCabin } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import supabase from "../supabase";
import {
  showToastMessage,
  useHandleUnAuthorisedResponse,
} from "../_utils/utils";
import { Cabin } from "../_utils/types";
import { IoCloseOutline } from "react-icons/io5";
import { useModal } from "./Modal";

type CabinData = {
  name: string;
  discount: number;
  image: string | undefined;
  regularPrice: number;
  maxCapacity: number;
  description: string;
};

export default function CreateEditCabinForm({
  cabinToEdit,
}: {
  cabinToEdit?: Cabin;
}) {
  const [loading, setLoading] = useState(false);

  const { close } = useModal();
  const { _id: editId, ...editValues } = cabinToEdit ?? ({} as Cabin);
  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();
  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const discount = Number(formData.get("discount"));
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;
    const maxCapacity = Number(formData.get("maxCapacity"));
    const cabinFile = formData.get("image");
    const regularPrice = Number(formData.get("regularPrice"));

    const cabinData: CabinData = {
      discount,
      name,
      maxCapacity,
      description,
      regularPrice,
      image: undefined,
    };

    if (discount < 0 || regularPrice < 0) {
      toast.error("Price and discount cannot be negative");
      return;
    }

    if (discount && regularPrice && discount > regularPrice) {
      toast.error("Discount should not be more than price");
      return;
    }

    const token = getToken();
    if (!token) return;

    setLoading(true);
    if (cabinFile instanceof File) {
      const fileName = `${cabinFile.name}-${Date.now()}`;

      if (cabinFile.name) {
        const { data, error } = await supabase.storage
          .from("cabin-images")
          .upload(`public/${fileName}`, cabinFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error("Image could not be uploaded");
          setLoading(false); // Stop loading in case of error
          return;
        } else {
          cabinData.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
        }
      }
    }

    let res;
    if (isEditSession) {
      res = await updateCabin(token, editId, cabinData);
    } else {
      res = await createCabin(token, cabinData);
    }

    handleUnAuthorisedResponse(res?.statusCode);

    showToastMessage(
      res?.status,
      res?.message,
      isEditSession
        ? "Cabin updated successfully"
        : "Cabin successfully created"
    );

    setLoading(false);
    close();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">{isEditSession ? "Edit" : "Create"} Cabin</h2>
        <button onClick={close}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <FormRow htmlFor="cabin_name" label="Cabin name" orientation="horizontal">
        <Input
          defaultValue={editValues?.name}
          name="name"
          id="cabin_name"
          required={true}
          type="text"
        />
      </FormRow>

      <FormRow
        htmlFor="cabin_maxCapacity"
        label="Maximum capacity"
        orientation="horizontal"
      >
        <Input
          defaultValue={editValues?.maxCapacity}
          name="maxCapacity"
          required={true}
          id="cabin_maxCapacity"
          type="number"
        />
      </FormRow>

      <FormRow
        htmlFor="cabin_price"
        label="Regular price"
        orientation="horizontal"
      >
        <Input
          defaultValue={editValues?.regularPrice}
          name="regularPrice"
          required={true}
          id="cabin_price"
          type="number"
        />
      </FormRow>

      <FormRow
        htmlFor="cabin_discount"
        label="Discount"
        orientation="horizontal"
      >
        <Input
          defaultValue={editValues?.discount}
          name="discount"
          required={true}
          id="cabin_discount"
          type="number"
        />
      </FormRow>

      <FormRow
        htmlFor="website_descr"
        label="Description for website"
        orientation="horizontal"
      >
        <Textarea
          defaultValue={editValues?.description}
          required={true}
          className="py-[1rem] md:text-[16px] px-[1.2rem] bg-[var(--color-grey-0)] appearance-none focus:ring-0 border border-[var(--color-grey-300)] rounded-[var(--border-radius-sm)]"
          name="description"
          id="website_descr"
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Cabin photo" htmlFor="my-image">
        <FileInput loading={false} />
      </FormRow>

      <Box className="flex justify-end gap-5 items-center">
        <Button type="cancel" onClick={close}>
          Cancel
        </Button>
        <Button loading={loading} type="primary" action="submit">
          {!isEditSession ? "Create new cabin" : "Edit cabin"}
        </Button>
      </Box>
    </form>
  );
}
