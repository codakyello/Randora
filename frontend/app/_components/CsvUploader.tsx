"use client";

import { Box } from "@chakra-ui/react";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "./Button";
import { useParams } from "next/navigation";
import { uploadParticipants } from "../_lib/data-service";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

export default function CsvUploader({ onClose }: { onClose?: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null); // State for file name
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const eventId = params.eventId as string;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Set file name
      setError(null); // Clear any previous errors
    } else {
      setFileName(null); // Reset file name
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

    setUploading(true);

    const res = await uploadParticipants(formData);

    if (res?.status !== "error") {
      onClose?.();
      toast.success("Participants imported Successfully");
    } else {
      setError(res?.message);
    }

    setUploading(false);
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
        className="block my-10  w-full p-4 text-center border border-dashed rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
        htmlFor="csvFileInput"
      >
        {"Click to upload a CSV file"}
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
