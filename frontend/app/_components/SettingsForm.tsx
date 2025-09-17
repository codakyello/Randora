"use client";

import { SettingsRandora } from "@/app/_utils/types";
import { updateOrganisation } from "@/app/_lib/data-service";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Box } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import Button from "./Button";
import SpinnerMini from "./SpinnerMini";
import { useUploadFile } from "../_hooks/useUploadFile";

const themePresets = [
  { primary: "#4F46E5" }, // Indigo
  { primary: "#0634f0" }, // Blue
  { primary: "#059669" }, // Emerald
  { primary: "#DC2626" }, // Red
  { primary: "#7C3AED" }, // Violet
];

export default function SettingsForm({
  organisation,
}: {
  organisation: SettingsRandora;
}) {
  const [settings, setSettings] = useState<SettingsRandora>(
    organisation || {
      brandColor: "",
      textLogo: "",
      coverLogo: "",
    }
  );
  const [tempColor, setTempColor] = useState(settings.brandColor);
  const [isLoading, setIsLoading] = useState(false);
  const { close: closeModal } = useModal();
  const { uploadFile } = useUploadFile();

  const handleLogoUpload =
    (type: "text" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);

        if (type === "text") {
          setSettings((prev) => ({ ...prev, textLogo: previewUrl }));
        } else {
          setSettings((prev) => ({ ...prev, coverLogo: previewUrl }));
        }
      }
    };

  const clearLogo = (type: "text" | "cover") => {
    console.log("logo cleared");
    if (type === "text") {
      setSettings((prev) => ({ ...prev, textLogo: "" }));
      const fileInput = document.getElementById(
        "text-logo-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setSettings((prev) => ({ ...prev, coverLogo: "" }));
      const fileInput = document.getElementById(
        "cover-logo-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleConfirmColor = () => {
    setSettings((prev) => ({
      ...prev,
      brandColor: tempColor,
    }));
    closeModal();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    // now no textlogo or coverlogo input
    const textLogoFile = formData.get("textLogo");
    const coverLogoFile = formData.get("coverLogo");

    const formInputs: {
      textLogo?: string;
      coverLogo?: string;
      brandColor?: string;
    } = {
      brandColor: tempColor || "",
    };

    // Start image uploading
    setIsLoading(true);

    // Handle text logo upload
    if (textLogoFile instanceof File && textLogoFile.name) {
      try {
        const fileFormData = new FormData();
        fileFormData.append("file", textLogoFile);
        const response = await uploadFile(fileFormData);
        const url = response.data?.data.ufsUrl;

        if (!response.success) {
          toast.error(
            (response.message as string) || "Failed to upload text logo"
          );
        } else if (response.data && url) {
          formInputs.textLogo = url;
          // toast.success("Text logo uploaded successfully");
        }
      } catch (error) {
        toast.error("Failed to upload text logo");
        console.error("Failed to upload text logo:", error);
      }
    }

    // Handle cover logo upload
    if (coverLogoFile instanceof File && coverLogoFile.name) {
      try {
        const fileFormData = new FormData();
        fileFormData.append("file", coverLogoFile);
        const response = await uploadFile(fileFormData);
        const url = response.data?.data.ufsUrl;

        if (!response.success) {
          toast.error(
            (response.message as string) || "Failed to upload cover logo"
          );
        } else if (response.data && url) {
          formInputs.coverLogo = url;
          // toast.success("Cover logo uploaded successfully");
        }
      } catch (error) {
        toast.error("Failed to upload cover logo");
        console.error("Failed to upload cover logo:", error);
      }
    }

    // If logos are cleared, ensure formInputs reflect that
    if (!settings.textLogo) formInputs.textLogo = "";
    if (!settings.coverLogo) formInputs.coverLogo = "";

    if (!organisation?._id) {
      toast.error("Organisation not found here");
      setIsLoading(false);
      return;
    }
    try {
      const res = await updateOrganisation(formInputs, organisation._id);

      if (res?.status === "success") {
        toast.success("Settings updated successfully");
      } else {
        toast.error(res?.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update settings");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="space-y-12">
        {/* Branding Section */}
        <Box className="bg-[var(--color-grey-0)] rounded-2xl p-8 space-y-8">
          <Box>
            <h2 className="text-[1.25em] font-semibold">Branding</h2>
            <p className="mt-1">
              Customize how your brand appears on the event page
            </p>
          </Box>

          <Box className="grid bg-[var(--color-grey-0)] p-8 grid-cols-1 lg:grid-cols-[1fr,1fr] gap-12">
            {/* Left Column - Text Logo */}
            <Box className="space-y-8">
              <Box className="space-y-4">
                <label className="font-medium">Text Logo</label>
                <Box className="flex items-center gap-4">
                  <Box className="w-16 h-16 relative">
                    {settings?.textLogo ? (
                      <Box className="relative w-full h-full">
                        <Image
                          src={settings?.textLogo}
                          alt="Text logo"
                          fill
                          className="object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => clearLogo("text")}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[var(--color-grey-0)] border shadow-sm hover:bg-neutral-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Box>
                    ) : (
                      <Box className="w-full h-full rounded-lg grid place-items-center">
                        <Upload />
                      </Box>
                    )}
                  </Box>
                  <input
                    type="file"
                    name="textLogo"
                    accept="image/*"
                    onChange={handleLogoUpload("text")}
                    className="hidden"
                    id="text-logo-upload"
                  />
                  <label
                    htmlFor="text-logo-upload"
                    className="px-4 py-2 font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 cursor-pointer"
                  >
                    Upload Text Logo
                  </label>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Cover Logo */}
            <Box className="space-y-8">
              <Box className="space-y-4">
                <label className="font-medium">Cover Logo</label>
                <Box className="flex items-center gap-4">
                  <Box className="w-16 h-16 relative">
                    {settings?.coverLogo ? (
                      <Box className="relative w-full h-full">
                        <Image
                          src={settings?.coverLogo}
                          alt="Cover logo"
                          fill
                          className="object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => clearLogo("cover")}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[var(--color-grey-0)] border shadow-sm hover:bg-neutral-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Box>
                    ) : (
                      <Box className="w-full h-full rounded-lg grid place-items-center">
                        <Upload />
                      </Box>
                    )}
                  </Box>
                  <input
                    type="file"
                    name="coverLogo"
                    accept="image/*"
                    onChange={handleLogoUpload("cover")}
                    className="hidden"
                    id="cover-logo-upload"
                  />
                  <label
                    htmlFor="cover-logo-upload"
                    className="px-4 py-2 font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 cursor-pointer"
                  >
                    Upload Cover Logo
                  </label>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Preview Section */}
          <Box className="mt-8">
            <label className="block font-medium mb-4">Logo Previews</label>
            <Box className="grid grid-cols-2 gap-8">
              {/* Text Logo Preview */}
              <Box className="p-8 rounded-2xl border border-[var(--color-grey-200)] space-y-4">
                <h3 className="font-medium text-center">Text Logo Preview</h3>
                <Box className="h-32 relative mx-auto">
                  {settings?.textLogo ? (
                    <Image
                      src={settings?.textLogo}
                      alt="Text logo preview"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <Box className="w-full h-full rounded-lg grid place-items-center">
                      <Box className="text-center space-y-2">
                        <Upload className="w-8 h-8 mx-auto" />
                        <span>Upload a text logo to see preview</span>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Cover Logo Preview */}
              <Box className="p-8 rounded-2xl border border-[var(--color-grey-200)] space-y-4">
                <h3 className="font-medium text-center">Cover Logo Preview</h3>
                <Box className="h-32 relative mx-auto">
                  {settings?.coverLogo ? (
                    <Image
                      src={settings?.coverLogo}
                      alt="Cover logo preview"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <Box className="w-full h-full rounded-lg grid place-items-center">
                      <Box className="text-center space-y-2">
                        <Upload className="w-8 h-8 mx-auto" />
                        <span>Upload a cover logo to see preview</span>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <p className="mt-4 text-[1.4rem]">
              Note: Make sure your logos looks good on both light and dark
              backgrounds
            </p>
          </Box>
        </Box>

        {/* Theme Section */}
        <Box className="rounded-2xl p-8 bg-[var(--color-grey-0)] mt-10 space-y-6">
          <Box>
            <h2 className="font-semibold">Theme</h2>
            <p>Choose colors and styles for your event page</p>
          </Box>

          <Box className="space-y-6">
            {/* Color Presets */}
            <Box>
              <label className="block font-medium mb-2">Color Presets</label>
              <Box className="flex gap-4">
                {themePresets.map((theme, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setTempColor(theme.primary);
                      setSettings((prev) => ({
                        ...prev,
                        brandColor: theme.primary,
                      }));
                    }}
                    className={`aspect-square w-24 rounded-2xl border transition-all ${
                      settings.brandColor === theme.primary
                        ? "border-indigo-600 scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: theme.primary }}
                  />
                ))}
              </Box>
            </Box>
            {/* Custom Color Picker */}
            <Box>
              <label className="block font-medium mb-2">Custom Color</label>
              <Box className="flex items-center gap-4">
                <ModalOpen name="color-picker">
                  <button
                    type="button"
                    className="w-20 aspect-square rounded-lg border-2 border-neutral-200 transition-all hover:scale-105"
                    style={{ backgroundColor: settings.brandColor }}
                  />
                </ModalOpen>
                <ModalWindow name="color-picker">
                  <Box className="space-y-4 w-[35rem]">
                    <HexColorPicker
                      color={tempColor}
                      onChange={handleColorChange}
                      style={{ width: "100%" }}
                    />
                    <Box className="flex mt-2 items-center gap-4">
                      <Button
                        type="primary"
                        onClick={handleConfirmColor}
                        className="px-4 py-2 font-medium rounded-md"
                      >
                        Confirm
                      </Button>

                      <Button
                        type="cancel"
                        onClick={closeModal}
                        className="px-4 py-2 font-medium rounded-md "
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </ModalWindow>

                <span>Click to choose a custom color</span>
              </Box>
            </Box>

            {/* Preview */}
            <Box className="mt-8 rounded-[var(--border-radius-md)]  space-y-4 ">
              <label className="block font-medium mb-2">Preview</label>
              <Box className="p-4 rounded-lg  space-y-4">
                <Box className="space-y-2">
                  <Box className="font-medium">Buttons</Box>
                  <Box className="flex gap-4">
                    <button
                      type="button"
                      className="px-6 py-4 rounded-2xl text-white"
                      style={{ backgroundColor: settings.brandColor }}
                    >
                      Primary Button
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-2xl border"
                      style={{
                        borderColor: settings.brandColor,
                        color: settings.brandColor,
                      }}
                    >
                      Secondary Button
                    </button>
                  </Box>
                </Box>

                <Box className="space-y-2">
                  <Box className="font-medium">Text</Box>
                  <Box className="space-y-1">
                    <Box style={{ color: settings.brandColor }}>Text Color</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="flex justify-end">
          <Button
            action="submit"
            type="primary"
            disabled={isLoading}
            className="w-[15rem] h-[5rem] px-4 py-2 font-medium "
          >
            {isLoading ? <SpinnerMini /> : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
