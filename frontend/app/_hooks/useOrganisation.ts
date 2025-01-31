"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../_contexts/AuthProvider";
import { getEventOrganisation } from "../_lib/data-service";

export default function useOrganisation() {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ["organisation"],
    queryFn: () => getEventOrganisation(user?.organisationId),
  });

  return { data, error, isLoading };
}
