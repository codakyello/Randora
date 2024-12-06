"use client";

import { getAllCollaborators } from "../_lib/data-service";
import { useQuery } from "@tanstack/react-query";

export default function useCollaborators(organisationId: string) {
  const {
    data = { collaborators: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["collaborators"],
    queryFn: () => getAllCollaborators(organisationId),
  });

  return { data, error, isLoading };
}
