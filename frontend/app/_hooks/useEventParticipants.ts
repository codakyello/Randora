"use client";
import { getEventParticipants, getMyEvents } from "../_lib/data-service";
import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventParticipants(eventId: string) {
  const searchParams = useSearchParams();

  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"),
  };

  const {
    data = { participants: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: [`events/${eventId}/participants`, queryParams],
    queryFn: () => getEventParticipants(eventId, queryParams),
  });

  return { data, error, isLoading };
}
