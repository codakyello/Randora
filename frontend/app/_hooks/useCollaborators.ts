"use client";

import { getAllCollaborators } from "../_lib/data-service";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useCollaborators(organisationId: string) {
  const searchParams = useSearchParams();
  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"), // default to "date"
  };

  const {
    data = { collaborators: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events", queryParams],
    queryFn: () => getAllCollaborators(organisationId, queryParams),
  });

  return { data, error, isLoading };
}
