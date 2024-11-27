import { getBookingAfterDate } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "../_utils/types";

export default function useStaysAfterDate() {
  const searchParams = useSearchParams();
  const numDays = Number(searchParams.get("last")) || 7; // default to "date"
  const { getToken } = useAuth();
  const token = getToken();

  const {
    data: stays,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["stays", `last-${numDays}`],
    queryFn: () => getBookingAfterDate(token, numDays),
  });
  const confirmedStays = stays?.filter(
    (stay: Booking) =>
      stay.status === "checked-in" || stay.status === "checked-out"
  );
  return { confirmedStays, error, isLoading };
}
