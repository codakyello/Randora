import { useQuery } from "@tanstack/react-query";
import { getUpcomingEvents } from "../_lib/data-service";
import { isAfter, isSameDay } from "date-fns";
import { Event } from "../_utils/types";

export default function useUpcomingEvents() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: () => getUpcomingEvents(),
  });

  const upcomingEvents = data
    ?.filter(
      (event: Event) =>
        (event.status === "inactive" &&
          isAfter(new Date(event.startDate), new Date())) ||
        isSameDay(new Date(event.startDate), new Date())
    )
    .reverse();

  return { data: upcomingEvents, error, isLoading };
}
