"use client";
import { Box } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import Button from "./Button";
import { FormEvent, useState } from "react";
import { createPrizes as createPrizeApi } from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
// import supabase from "../supabase";
import { IoCloseOutline } from "react-icons/io5";
import { Prize } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import { useParams } from "next/navigation";
import { useMenu } from "./Menu";
import { FaTrash } from "react-icons/fa";

export default function CreatePrizeForm({
  prizeToEdit,
  onClose,
  eventId,
}: {
  prizeToEdit?: Prize;
  onClose?: () => void;
  eventId?: string;
}) {
  const { _id: editId, ...editValues } = prizeToEdit ?? ({} as Prize);
  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();
  const token = getToken();

  const params = useParams();

  const { close: closeMenu } = useMenu();
  // const [uploading, setUploading] = useState(false);

  const { mutate: createPrize, isPending: isCreating } =
    useCustomMutation(createPrizeApi);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const names = formData.getAll("name");
    const quantities = formData.getAll("quantity");

    const prizes = names.map((name, i) => {
      return {
        name: String(name),
        quantity: Number(quantities[i]),
        eventId: eventId || String(params.eventId),
      };
    });

    const prizeForm = prizes;

    createPrize(
      { prizeForm, token },
      {
        onSuccess: () => {
          toast.success("Prize created successfully");
          onClose?.();
          closeMenu();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const [inputs, setInputs] = useState([{ name: "", quantity: "" }]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputName = event.target.name;
    setInputs((inputs) =>
      inputs.map((input, i) =>
        index === i
          ? {
              ...input,
              [inputName === "name" ? "name" : "quantity"]: event.target.value,
            }
          : input
      )
    );
  };

  const handleDeleteInput = (index: number) => {
    if (index === 0) return;
    setInputs((inputs) => inputs.filter((_, i) => index !== i));
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

      <Box className="grid grid-cols-[8fr_2fr] max-h-[50vh] overflow-auto no-scrollbar gap-5">
        <FormRow
          className="!pb-0 border-none"
          htmlFor="name"
          label="Name (required)"
          orientation="horizontal"
        />

        <FormRow
          className="!pb-0 border-none"
          htmlFor="prize_quantity"
          label="Quantity (required)"
          orientation="horizontal"
        />

        {inputs.map(({ name, quantity }, index) => (
          <>
            <Input
              className="h-[4.5rem]"
              key={index}
              defaultValue={editValues?.name}
              name="name"
              value={name}
              id="name"
              required={true}
              onChange={(e) => handleInputChange(e, index)}
              type="text"
            />
            <Box className="flex gap-5">
              <Input
                className="h-[4.5rem]"
                defaultValue={editValues?.quantity}
                value={quantity}
                name="quantity"
                id="prize_quantity"
                required={true}
                onChange={(e) => handleInputChange(e, index)}
                type="number"
              />

              <Button
                className="!p-2 h-full aspect-square"
                type="cancel"
                action="button"
                onClick={() => handleDeleteInput(index)}
              >
                <FaTrash color="red" size={15} />{" "}
              </Button>
            </Box>
          </>
        ))}
      </Box>

      <Button
        className="mt-5"
        action="button"
        type="cancel"
        onClick={() =>
          setInputs((inputs) => [...inputs, { name: "", quantity: "" }])
        }
      >
        Add new
      </Button>
      <Box className="flex  justify-end gap-5 mt-5 items-center">
        <Button onClick={onClose} type="cancel">
          Cancel
        </Button>
        <Button
          className="w-[12rem] h-[4.5rem]"
          loading={isCreating}
          type="primary"
          action="submit"
        >
          Create prize
        </Button>
      </Box>
    </form>
  );
}
