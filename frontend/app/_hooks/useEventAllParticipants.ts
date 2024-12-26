"use client";
import { getEventAllParticipants } from "../_lib/data-service";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useEventParticipants(eventId: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [`events/${eventId}/all-participants`],
    queryFn: () => getEventAllParticipants(eventId),
  });

  console.log(data);

  if (data?.statusCode === 404) return notFound();

  return { data, error, isLoading };
}
