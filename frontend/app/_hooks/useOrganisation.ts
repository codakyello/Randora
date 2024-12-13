// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { useAuth } from "../_contexts/AuthProvider";
// import { getOrganisation } from "../_lib/actions";

// export default function useOrganisation() {
//   const { user, getToken } = useAuth();
//   const token = getToken();
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["organisation"],
//     queryFn: () => getOrganisation(user?.organisationId, token),
//   });

//   return { data, error, isLoading };
// }
