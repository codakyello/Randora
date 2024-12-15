import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box } from "@chakra-ui/react";
import { Event } from "../_utils/types";
import { useDarkMode } from "../_contexts/DarkModeProvider";

function ParticipantChart({ events }: { events: Event[] }) {
  console.log(events);
  const { isDarkMode } = useDarkMode();

  const data = events.map((event) => {
    return {
      label: event.name,
      participants: event.participantCount,
      prizeDistribution: event.prizeCount - event.remainingPrize,
    };
  });

  const colors = isDarkMode
    ? {
        participants: { stroke: "#4f46e5", fill: "#bab9ff", text: "#333" },
        prizeDistribution: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#bab9ff",
        background: "#18212f",
      }
    : {
        participants: { stroke: "#4f46e5", fill: "#bab9ff", text: "#bab9ff" },
        prizeDistribution: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#bab9ff",
        background: "#fff",
      };

  return (
    <Box className="bg-[var(--color-grey-0)] flex flex-col gap-10 p-[1.6rem] rounded-2xl ">
      <h2>Total number of participants per event</h2>
      <ResponsiveContainer
        className={events.length > 1 ? "ml-[-2.5rem]" : ""}
        height={350}
        width="100%"
      >
        {events.length ? (
          <AreaChart data={data}>
            <XAxis
              dataKey="label"
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <YAxis
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <CartesianGrid strokeDasharray="2" />
            <Tooltip contentStyle={{ backgroundColor: colors.background }} />
            <Area
              dataKey="participants"
              type="monotone"
              stroke={colors.participants.stroke}
              fill={colors.participants.fill}
              strokeWidth={2}
              name="Total participants"
            />
            <Area
              dataKey="prizeDistribution"
              type="monotone"
              stroke={colors.prizeDistribution.stroke}
              fill={colors.prizeDistribution.fill}
              strokeWidth={2}
              name="Prize distribution"
            />
          </AreaChart>
        ) : (
          <Box className="flex items-center justify-center h-full">
            <p className="text-[1.6rem]">Events analytics will appear here</p>
          </Box>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

export default ParticipantChart;
