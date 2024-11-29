import BookingTable from "./BookingTable";

export default async function Events() {
  // const bookings = data.bookings;
  // const count = data.totalCount;
  const events = await getEvents();

  return events.length ? (
    <BookingTable count={count} events={events} />
  ) : (
    <h2 className="mt-5">No Events Found</h2>
  );
}
