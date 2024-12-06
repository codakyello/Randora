"use client";
import { getEventParticipants } from "../_lib/data-service";
import { notFound, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventParticipants(eventId: string) {
  const searchParams = useSearchParams();

  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"),
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`events/${eventId}/participants`, queryParams],
    queryFn: () => getEventParticipants(eventId, queryParams),
  });
  if (data?.statusCode === 404) return notFound();

  return { data, error, isLoading };
}
