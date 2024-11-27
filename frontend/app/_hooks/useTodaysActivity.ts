import { getAllBookings } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isToday } from "date-fns";
import { Booking } from "../_utils/types";

export default function useTodayActivity() {
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
    queryKey: ["today-activity"],
    queryFn: () => getAllBookings(token, queryParams),
  });
  const activities = data.bookings.filter((booking: Booking) => {
    return (
      (booking.status === "unconfirmed" &&
        isToday(new Date(booking.startDate))) ||
      (booking.status === "checked-in" && isToday(new Date(booking.endDate)))
    );
  });

  console.log(activities);
  return { activities, error, isLoading };
}
