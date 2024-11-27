import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi";
import { HiOutlineBanknotes, HiOutlineCalendarDays } from "react-icons/hi2";
import Stat from "./Stat";
import { Booking } from "../_utils/types";
import { formatCurrency } from "../_utils/helpers";

export default function Stats({
  bookings,
  cabinCount,
  numDays,
}: {
  bookings: Booking[];
  cabinCount: number;
  numDays: number;
}) {
  const numBookings = bookings.length;
  const confirmedStays = bookings.filter(
    (booking) =>
      booking.status === "checked-in" || booking.status === "checked-out"
  );
  const totalSales = formatCurrency(
    bookings
      ?.filter(
        (booking) =>
          booking.status === "checked-in" || booking.status === "checked-out"
      )
      .reduce((acc, curr) => acc + curr.totalPrice, 0)
  );
  const occupancyRate =
    Math.round(
      (confirmedStays.reduce((acc, curr) => acc + curr.numNights, 0) /
        (numDays * cabinCount)) *
        100
    ) || 0;
  const stats = [
    {
      icon: <HiOutlineBriefcase />,
      title: "Bookings",
      value: numBookings,
      color: "blue",
    },
    {
      icon: <HiOutlineBanknotes />,
      title: "Sales",
      value: totalSales,
      color: "green",
    },
    {
      icon: <HiOutlineCalendarDays />,
      title: "Check INS",
      value: confirmedStays.length,
      color: "indigo",
    },
    {
      icon: <HiOutlineChartBar />,
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      color: "yellow",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Stat
          key={stat.title}
          name={stat.title}
          stat={stat.value}
          color={stat.color}
          icon={stat.icon}
        />
      ))}
    </>
  );
}
