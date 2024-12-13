import SettingsForm from "@/app/_components/SettingsForm";
import Modal from "@/app/_components/Modal";
import { getOrganisation, getUser } from "@/app/_lib/data-service";
export default async function SettingsPage() {
  const user = await getUser();
  const organisation = await getOrganisation(user?.organisationId);
  console.log(organisation);
  return (
    <Modal>
      <div className="px-8">
        <div className="flex flex-col mx-auto space-y-12">
          <div>
            <h1 className=" font-bold">Settings</h1>
            <p>
              Customize your event page appearance and manage your preferences
            </p>
          </div>

          <SettingsForm organisation={organisation} />
        </div>
      </div>
    </Modal>
  );
}
