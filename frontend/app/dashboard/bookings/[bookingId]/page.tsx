import Booking from "@/app/_components/Booking";
import Modal from "@/app/_components/Modal";
import { getSettings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Booking",
};

async function Page({ params }: { params: { bookingId: string } }) {
  const bookingId = params.bookingId;

  const settings = await getSettings();

  return (
    <Modal>
      <Booking settings={settings} bookingId={bookingId} />
    </Modal>
  );
}

export default Page;
