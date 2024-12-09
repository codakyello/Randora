import { SettingsRandora } from "@/app/_utils/types";
import SettingsForm from "@/app/_components/SettingsForm";
import { cookies } from "next/headers";
import { getUserSettings } from "@/app/_lib/data-service";
import Modal from "@/app/_components/Modal";

export default async function SettingsPage() {
  const token = cookies().get("auth_token")?.value;
  const settingsRes = await getUserSettings(token);
  const settings =
    settingsRes.status === "success"
      ? (settingsRes.data as SettingsRandora)
      : null;

  return (
    <Modal>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mx-auto space-y-12">
          <div>
            <h1 className=" font-bold">Settings</h1>
            <p>
              Customize your event page appearance and manage your preferences
            </p>
          </div>

          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </Modal>
  );
}
