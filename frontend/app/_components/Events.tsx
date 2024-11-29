"use client";
import useEvents from "../_hooks/useEvents";
import EventTable from "./EventTable";
import SpinnerFull from "./SpinnerFull";

export default function Events() {
  const { data, isLoading, error } = useEvents();

  const events = data?.events;
  const count = data?.totalCount;

  if (isLoading) return <SpinnerFull />;
  if (error) return <h2>No Events Found</h2>;
  return events?.length ? (
    <EventTable count={count} events={events} />
  ) : (
    <h2 className="mt-5">No Events Found</h2>
  );
}
