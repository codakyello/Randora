import { getMyEvents } from "../_lib/data-service";
import EventTable from "./EventTable";

export default async function Events({
  searchParams,
}: {
  searchParams: { status: string; page: string; sortBy: string };
}) {
  const { status, page, sortBy } = searchParams;
  // const bookings = data.bookings;
  // const count = data.totalCount;
  console.log("here");
  const data = await getMyEvents({ status, page, sortBy });
  const events = data?.events;
  const count = data?.totalCount;

  return events?.length ? (
    <EventTable count={count} events={events} />
  ) : (
    <h2 className="mt-5">No Events Found</h2>
  );
}
