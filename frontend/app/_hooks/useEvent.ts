"use client";
import { notFound } from "next/navigation";
import { getEvent } from "../_lib/data-service";
import { useQuery } from "@tanstack/react-query";

export default function useEvent(eventId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["event"],
    queryFn: () => getEvent(eventId),
  });

  // return { status: "error", statusCode, message: err.message };

  console.log(data);
  if (data?.statusCode === 404) return notFound();
  return { data, isLoading, error };
}
