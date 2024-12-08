import { SettingsRandora } from "@/app/_utils/types";
import SettingsForm from "@/app/_components/SettingsForm";
import { cookies } from "next/headers";
import { getUserSettings } from "@/app/_lib/data-service";
export default async function SettingsPage() {
  const token = cookies().get("auth_token")?.value;
  const settingsRes = await getUserSettings(token);
  const settings =
    settingsRes.status === "success"
      ? (settingsRes.data as SettingsRandora)
      : null;

  return (
    <div className="min-h-screen pt-14 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="mx-auto space-y-12">
          <div>
            <h1 className="text-[2em] font-bold text-neutral-900">Settings</h1>
            <p className="text-[1.125em] text-neutral-600 mt-3">
              Customize your event page appearance and manage your preferences
            </p>
          </div>

          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
