"use client";

import { SettingsRandora, ThemeColor } from "@/app/_utils/types";
import { updateUserSettings } from "@/app/_lib/data-service";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Upload, X } from "lucide-react";
// import { HexColorPicker } from "react-colorful";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
      brandLogo: "",
      brandName: "",
      spinnerStyle: "classic",
      confettiEnabled: true,
      soundEnabled: true,
    }
  );
  // const [tempColor, setTempColor] = useState(settings.theme.primary);
  // const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoPreviewUrl = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup function to revoke URLs when component unmounts
    return () => {
      if (logoPreviewUrl.current) {
        URL.revokeObjectURL(logoPreviewUrl.current);
      }
    };
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Always revoke the previous URL before creating a new one
      if (logoPreviewUrl.current) {
        URL.revokeObjectURL(logoPreviewUrl.current);
        logoPreviewUrl.current = null;
      }

      const previewUrl = URL.createObjectURL(file);
      logoPreviewUrl.current = previewUrl;

      setLogoFile(file);
      setSettings((prev) => ({
        ...prev,
        brandLogo: previewUrl,
      }));
    }
  };

  const clearLogo = () => {
    if (logoPreviewUrl.current) {
      URL.revokeObjectURL(logoPreviewUrl.current);
      logoPreviewUrl.current = null;
    }

    setSettings((prev) => ({ ...prev, brandLogo: "" }));
    setLogoFile(null);

    // Reset the file input
    const fileInput = document.getElementById(
      "logo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // const handleColorChange = (color: string) => {
  //   console.log("Selected color:", color);
  //   setTempColor(color);
  // };

  // const handleConfirmColor = () => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     theme: {
  //       ...prev.theme,
  //       primary: tempColor,
  //       secondary: tempColor,
  //     },
  //   }));
  //   setIsColorPickerOpen(false);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedSettings = { ...settings };

      // Upload logo if there's a new file
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Logo upload failed");

        const { url } = await uploadRes.json();
        updatedSettings.brandLogo = url;
      }
      const token = "";
      const res = await updateUserSettings(updatedSettings, token);
      if (res.status === "success") {
        toast.success("Settings updated successfully");
        setLogoFile(null); // Clear the stored file
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Branding Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-8 shadow-sm">
        <div>
          <h2 className="text-[1.25em] font-semibold text-neutral-900">
            Branding
          </h2>
          <p className="text-[0.875em] text-neutral-600 mt-1">
            Customize how your brand appears on the event page
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-12">
          {/* Left Column - Upload Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[0.875em] font-medium">
                Brand Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  {settings.brandLogo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={settings.brandLogo}
                        alt="Brand logo"
                        fill
                        className="rounded-lg border object-contain bg-white"
                      />
                      <button
                        type="button"
                        onClick={clearLogo}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-white border shadow-sm hover:bg-neutral-50"
                      >
                        <X className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-lg border-2 border-dashed border-neutral-300 grid place-items-center">
                      <Upload className="text-neutral-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="px-4 py-2 font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 cursor-pointer"
                >
                  Upload Logo
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
                    src={settings.brandLogo}
                    alt="Logo preview"
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
              </div>
              <div className="text-center space-y-2">
                <div className="text-[1.25em] font-medium text-neutral-900">
                  {settings.brandName || "Your Brand Name"}
                </div>
                <p className="text-[0.875em] text-neutral-600">
                  {settings.brandName
                    ? "Brand name preview"
                    : "Enter a brand name to see preview"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        </button>
      </div>
    </form>
  );
}
