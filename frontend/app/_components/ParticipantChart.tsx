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
  const { isDarkMode } = useDarkMode();

  const data = events.map((event) => {
    return {
      label: event.name,
      participants: event.participantCount,
    };
  });

  console.log(data);

  const colors = isDarkMode
    ? {
        participants: { stroke: "#4f46e5", fill: "#bab9ff", text: "#333" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        participants: { stroke: "#4f46e5", fill: "#bab9ff", text: "#bab9ff" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <Box className="bg-[var(--color-grey-0)] flex flex-col gap-10 p-[1.6rem] rounded-2xl ">
      <h2>Total number of participants per event</h2>
      <ResponsiveContainer className={"ml-[-2.5rem]"} height={350} width="100%">
        {events.length ? (
          <AreaChart data={data.reverse()}>
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
          </AreaChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

export default ParticipantChart;
