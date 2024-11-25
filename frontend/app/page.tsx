"use client";
import React, { useState } from "react";

const CsvUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    console.log(formData.get("file"));

    formData.append("eventId", "123456");

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

      setSuccessMessage("File uploaded successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded shadow-lg">
      <h1 className="text-xl font-semibold mb-4">Upload CSV File</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            name="file"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`px-4 py-2 text-white rounded ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {successMessage && (
        <p className="text-green-500 text-sm mt-4">{successMessage}</p>
      )}
    </div>
  );
};

export default CsvUploader;
