import { getMyEvents } from "../_lib/data-service";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEvents() {
  const searchParams = useSearchParams();
  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"), // default to "date"
  };

  const {
    data = { events: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events", queryParams],
    queryFn: () => getMyEvents(queryParams),
  });

  return { data, error, isLoading };
}
