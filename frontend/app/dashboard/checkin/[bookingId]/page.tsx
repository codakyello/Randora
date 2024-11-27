import CheckIn from "@/app/_components/Checkin";
import { getSettings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Booking",
};

async function Page({ params }: { params: { bookingId: string } }) {
  const bookingId = params.bookingId;

  const settings = await getSettings();

  return <CheckIn bookingId={bookingId} settings={settings} />;
}

export default Page;
