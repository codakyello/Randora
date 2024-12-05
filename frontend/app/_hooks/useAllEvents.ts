import { getAllEvents } from "../_lib/data-service";
import { useQuery } from "@tanstack/react-query";

export default function useAllEvents() {
  const {
    data = { events: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });

  return { data, error, isLoading };
}
