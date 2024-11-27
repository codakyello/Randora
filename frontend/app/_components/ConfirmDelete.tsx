"use client";
import { Box } from "@chakra-ui/react";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";
import { IoCloseOutline } from "react-icons/io5";
import { useModal } from "./Modal";

export default function ConfirmDelete({
  resourceName,
  onConfirm,
  isDeleting,
}: {
  resourceName: string;
  isDeleting: boolean;
  onConfirm: () => void;
}) {
  const { close } = useModal();
  return (
    <Box className="max-w-[45rem] flex flex-col gap-[1.2rem] px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)]">
      <Box className="flex justify-between">
        <h3>Delete {resourceName}</h3>
        <button onClick={close}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <p className="mb-[1.2rem] text-[var(--color-grey-500)]">
        Are you sure you want to delete this {resourceName.toLowerCase()}{" "}
        permanently? This action cannot be undone.
      </p>

      <Box className="justify-end gap-5  flex ">
        <Button onClick={close} type="cancel">
          Cancel
        </Button>
        <Button loading={isDeleting} onClick={onConfirm} type="danger">
          {!isDeleting ? "Delete" : <SpinnerMini />}
        </Button>
      </Box>
    </Box>
  );
}
