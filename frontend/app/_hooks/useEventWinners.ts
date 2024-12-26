"use client";
import { getEventWinners } from "../_lib/data-service";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventWinners(eventId: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [`events/${eventId}/winners`],
    queryFn: () => getEventWinners(eventId),
  });

  if (data?.statusCode === 404) return notFound();

  return { data, error, isLoading };
}
