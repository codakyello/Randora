import { getBookingAfterDate } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function useBookingsAfterDate() {
  const searchParams = useSearchParams();
  const numDays = Number(searchParams.get("last")) || 7; // default to "date"
  const { getToken } = useAuth();
  const token = getToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["bookings", `last-${numDays}`],
    queryFn: () => getBookingAfterDate(token, numDays),
  });

  return { data, error, isLoading };
}
