import Event from "@/app/_components/Event";

export const metadata = {
  title: "Event",
};

function EventPage({ params }: { params: { eventId: string } }) {
  return <Event params={params} />;
}

export default EventPage;
