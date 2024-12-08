"use client";
import { getEventPrizes } from "../_lib/data-service";
import { notFound, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventPrizes(eventId: string) {
  const searchParams = useSearchParams();

  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"),
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`events/${eventId}/prizes`, queryParams],
    queryFn: () => getEventPrizes(eventId, queryParams),
  });

  console.log(data);

  if (data?.statusCode === 404) return notFound();

  return { data, error, isLoading };
}
