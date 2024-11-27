import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { Box } from "@chakra-ui/react";
import { Booking } from "../_utils/types";
import { useDarkMode } from "../_contexts/DarkModeProvider";

function SalesChart({
  bookings,
  numDays,
}: {
  bookings: Booking[];
  numDays: number;
}) {
  const { isDarkMode } = useDarkMode();

  const allDates: Date[] = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales:
        bookings
          .filter((booking) => isSameDay(date, new Date(booking.created_at)))
          .reduce((acc, cur) => acc + cur.extrasPrice, 0) || 0,
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <Box className="flex justify-center flex-col gap-8 rounded-[var(--border-radius-md)] bg-[var(--color-grey-0)] col-span-full pt-[2.4rem] pb-[3.2rem] px-[3.2rem]">
      <h2>
        Sales from {format(allDates.at(0) ?? new Date(), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1) ?? Date(), "MMM dd yyyy")}{" "}
      </h2>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default SalesChart;
