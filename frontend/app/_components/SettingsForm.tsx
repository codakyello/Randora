"use client";

import { SettingsRandora, ThemeColor } from "@/app/_utils/types";
import { updateUserSettings } from "@/app/_lib/data-service";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Box } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import Button from "./Button";

const themePresets: ThemeColor[] = [
  { primary: "#4F46E5", secondary: "#818CF8" }, // Indigo
  { primary: "#2563EB", secondary: "#60A5FA" }, // Blue
  { primary: "#059669", secondary: "#34D399" }, // Emerald
  { primary: "#DC2626", secondary: "#F87171" }, // Red
  { primary: "#7C3AED", secondary: "#A78BFA" }, // Violet
];

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: SettingsRandora | null;
}) {
  const [settings, setSettings] = useState<SettingsRandora>(
    initialSettings || {
      theme: themePresets[0],
      textLogo: "",
      coverLogo: "",
      brandName: "",
      spinnerStyle: "classic",
      confettiEnabled: true,
      soundEnabled: true,
    }
  );
  const [tempColor, setTempColor] = useState(settings.theme.primary);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textLogoFile, setTextLogoFile] = useState<File | null>(null);
  const [coverLogoFile, setCoverLogoFile] = useState<File | null>(null);
  const textLogoPreviewUrl = useRef<string | null>(null);
  const coverLogoPreviewUrl = useRef<string | null>(null);
  const { close: closeModal } = useModal();

  console.log(isColorPickerOpen);

  useEffect(() => {
    return () => {
      if (textLogoPreviewUrl.current) {
        URL.revokeObjectURL(textLogoPreviewUrl.current);
      }
      if (coverLogoPreviewUrl.current) {
        URL.revokeObjectURL(coverLogoPreviewUrl.current);
      }
    };
  }, []);

  const handleLogoUpload =
    (type: "text" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);

        if (type === "text") {
          if (textLogoPreviewUrl.current) {
            URL.revokeObjectURL(textLogoPreviewUrl.current);
          }
          textLogoPreviewUrl.current = previewUrl;
          setTextLogoFile(file);
          setSettings((prev) => ({ ...prev, textLogo: previewUrl }));
        } else {
          if (coverLogoPreviewUrl.current) {
            URL.revokeObjectURL(coverLogoPreviewUrl.current);
          }
          coverLogoPreviewUrl.current = previewUrl;
          setCoverLogoFile(file);
          setSettings((prev) => ({ ...prev, coverLogo: previewUrl }));
        }
      }
    };

  const clearLogo = (type: "text" | "cover") => {
    if (type === "text") {
      if (textLogoPreviewUrl.current) {
        URL.revokeObjectURL(textLogoPreviewUrl.current);
        textLogoPreviewUrl.current = null;
      }
      setSettings((prev) => ({ ...prev, textLogo: "" }));
      setTextLogoFile(null);
      const fileInput = document.getElementById(
        "text-logo-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      if (coverLogoPreviewUrl.current) {
        URL.revokeObjectURL(coverLogoPreviewUrl.current);
        coverLogoPreviewUrl.current = null;
      }
      setSettings((prev) => ({ ...prev, coverLogo: "" }));
      setCoverLogoFile(null);
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
      theme: {
        ...prev.theme,
        primary: tempColor,
        secondary: tempColor,
      },
    }));
    setIsColorPickerOpen(false);
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedSettings = { ...settings };

      // Upload logos if there are new files
      if (textLogoFile || coverLogoFile) {
        const formData = new FormData();
        if (textLogoFile) formData.append("textLogo", textLogoFile);
        if (coverLogoFile) formData.append("coverLogo", coverLogoFile);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Logo upload failed");

        const { textUrl, coverUrl } = await uploadRes.json();
        if (textUrl) updatedSettings.textLogo = textUrl;
        if (coverUrl) updatedSettings.coverLogo = coverUrl;
      }
      const token = "";
      const res = await updateUserSettings(updatedSettings, token);
      if (res.status === "success") {
        toast.success("Settings updated successfully");
        setTextLogoFile(null);
        setCoverLogoFile(null);
      } else {
        toast.error(res.data as string);
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
    <form onSubmit={handleSubmit} className="space-y-12">
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
                  {settings.textLogo ? (
                    <Box className="relative w-full h-full">
                      <Image
                        src={settings.textLogo}
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
                  {settings.coverLogo ? (
                    <Box className="relative w-full h-full">
                      <Image
                        src={settings.coverLogo}
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
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[0.875em] font-medium">
                Brand Name
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) =>
                  setSettings({ ...settings, brandName: e.target.value })
                }
                className="w-full rounded-md border-neutral-300 focus:border-indigo-600"
                placeholder="Enter your brand name"
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            <label className="block text-[0.875em] font-medium">Preview</label>
            <div className="p-8 rounded-lg border space-y-8 bg-white">
              <div className="h-32 relative mx-auto">
                {settings.brandLogo ? (
                  <Image
                    src={settings.coverLogo}
                    alt="Cover logo preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg border-2 border-dashed border-neutral-200 grid place-items-center">
                    <div className="text-center space-y-2">
                      <Upload className="w-8 h-8 text-neutral-300 mx-auto" />
                      <span className="text-[0.875em] text-neutral-400">
                        Upload a logo to see preview
                      </span>
                    </div>
                  </div>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Theme Section */}
      <div className="bg-white rounded-lg border p-6 space-y-6">
        <div>
          <h2 className="font-semibold">Theme</h2>
          <p className="text-neutral-600">
            Choose colors and styles for your event page
          </p>
        </div>

        <div className="space-y-6">
          {/* Color Presets */}
          <div>
            <label className="block font-medium mb-2">Color Presets</label>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-2 max-w-sm">
              {themePresets.map((theme, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, theme }))}
                  className={`aspect-square rounded-md border transition-all ${
                    settings.theme.primary === theme.primary
                      ? "border-indigo-600 scale-110 shadow-sm"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: theme.primary }}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <label className="block font-medium mb-2">Custom Color</label>
            <div className="flex items-center gap-4">
              {/* <Dialog
                open={isColorPickerOpen}
                onOpenChange={setIsColorPickerOpen}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-12 h-12 rounded-lg border-2 border-neutral-200 transition-all hover:scale-105"
                    style={{ backgroundColor: settings.theme.primary }}
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md w-full p-4 bg-white">
                  <div className="space-y-4">
                    <HexColorPicker
                      color={tempColor}
                      onChange={handleColorChange}
                      style={{ width: "100%" }}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsColorPickerOpen(false)}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-neutral-300 hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmColor}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog> */}
              <span className="text-neutral-600">
                Click to choose a custom color
              </span>
            </div>
          </div>

          {/* Logo Preview */}
          {settings.brandLogo && (
            <div className="mt-4">
              <label className="block font-medium mb-2">Logo Preview</label>
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-white">
                <Image
                  src={settings.brandLogo}
                  alt="Logo preview"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          <div>
            <label className="block font-medium mb-2">Preview</label>
            <div className="p-4 rounded-lg border space-y-4">
              <div className="space-y-2">
                <div className="font-medium">Buttons</div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: settings.theme.primary }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md border"
                    style={{
                      borderColor: settings.theme.primary,
                      color: settings.theme.primary,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Text</div>
                <div className="space-y-1">
                  <div style={{ color: settings.theme.primary }}>
                    Primary Text Color
                  </div>
                  <div style={{ color: settings.theme.secondary }}>
                    Secondary Text Color
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effects Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-8 shadow-sm">
        <div>
          <h2 className="text-[1.25em] font-semibold text-neutral-900">
            Effects
          </h2>
          <p className="text-[0.875em] text-neutral-600 mt-1">
            Configure animation and sound effects
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="block text-[0.875em] font-medium text-neutral-900">
                Confetti Effect
              </label>
              <p className="text-[0.75em] text-neutral-600">
                Show confetti animation when a winner is selected
              </p>
            </div>
            <label className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={settings.confettiEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    confettiEnabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block font-medium">Sound Effects</label>
              <p className="text-neutral-600">
                Play sound effects during spinning
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, soundEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </form>
  );
}
