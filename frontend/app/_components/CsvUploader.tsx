"use client";

import { Box } from "@chakra-ui/react";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "./Button";
import { useParams } from "next/navigation";
import { uploadParticipants as uploadParticipantsApi } from "../_lib/data-service";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import useCustomMutation from "../_hooks/useCustomMutation";

export default function CsvUploader({ onClose }: { onClose?: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null); // State for file name

  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  const eventId = params.eventId as string;

  const { isPending: isUploading, mutate: uploadParticipants } =
    useCustomMutation(uploadParticipantsApi);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("eventId", eventId);

    if (!fileName) {
      setError("No file selected.");
      return;
    }

    uploadParticipants(formData, {
      onSuccess: () => {
        toast.success("Participants uploaded successfully");
        onClose?.();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

    // if (res?.status !== "error") {
    //   onClose?.();
    //   toast.success("Participants imported Successfully");
    // } else {
    //   setError(res?.message);
    // }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">Upload file</h2>
        <button onClick={onClose}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <p>Select a .csv file to import participants at once</p>
      <label
        className="block rounded-xl my-10 text-black w-full p-4 text-center border border-dashed cursor-pointer bg-gray-100 hover:bg-gray-200"
        htmlFor="csvFileInput"
      >
        Click to upload a CSV file
      </label>
      <input
        id="csvFileInput"
        type="file"
        accept=".csv"
        name="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {fileName && (
        <p className="mt-2 text-blue-600">Selected File: {fileName}</p>
      )}
      {error && <p className="mt-2 text-red-600">{error}</p>}

      <Button
        disabled={isUploading}
        action="submit"
        className="h-[4rem] w-[9rem] mt-4"
        type="primary"
      >
        {isUploading ? <SpinnerMini /> : "Upload"}
      </Button>
    </form>
  );
}
