import React, { useState, FormEvent } from "react";

interface CsvUploaderProps {
  onUpload?: (data: string[]) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("file");

    console.log(file);

    formData.append("eventId", "67499b72ebc9f44740f4f087");
    if (!file) return;

    // if (!file.name.endsWith(".csv")) {
    //   setError("Please upload a valid CSV file.");
    //   return;
    // }

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/participants/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess("File updated successfully");
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setSuccess("");
        setError(err.message);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="csv-uploader p-4 border rounded shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">CSV Uploader</h2>

      <label
        className="block w-full p-4 text-center border border-dashed rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
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
      />

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}

      <button type="submit">Upload</button>
    </form>
  );
};

export default CsvUploader;
