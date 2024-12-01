"use client";
import { getEventPrizes } from "../_lib/data-service";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventPrizes(eventId: string) {
  const searchParams = useSearchParams();

  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"),
  };

  const {
    data = { prizes: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: [`events/${eventId}/prizes`, queryParams],
    queryFn: () => getEventPrizes(eventId, queryParams),
  });

  return { data, error, isLoading };
}
