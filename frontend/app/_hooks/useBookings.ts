import { getAllBookings } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useBookings() {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const queryParams = {
    page: searchParams.get("page"),
    status: searchParams.get("status"),
    sortBy: searchParams.get("sortBy"), // default to "date"
  };
  const { getToken } = useAuth();
  const token = getToken();

  const {
    data = { bookings: [], totalCount: 0 },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", queryParams],
    queryFn: () => getAllBookings(token, queryParams),
  });

  return { data, error, isLoading };
}
