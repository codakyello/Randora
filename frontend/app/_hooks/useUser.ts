// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { useAuth } from "../_contexts/AuthProvider";
// import toast from "react-hot-toast";
// import { getUser } from "../_lib/actions";

// export default function useUser() {
//   const { getToken } = useAuth();
//   const token = getToken();
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["user"],
//     queryFn: () => getUser(token),
//   });

//   if (error?.message.toLowerCase() === "failed to fetch")
//     toast.error("Unable to connect to the internet.");
//   else if (error) toast.error(error.message);

//   return { data, error, isLoading };
// }
