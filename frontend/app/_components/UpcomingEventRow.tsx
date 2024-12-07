import { Box } from "@chakra-ui/react";
import { Event } from "../_utils/types";
import { isToday } from "date-fns";
import { formatDistanceFromNow } from "../_utils/helpers";
import Link from "next/link";

export default function UpcomingEventRow({ event }: { event: Event }) {
  return (
    <Box className="border-b border-[var(--color-grey-100)] gap-x-[2rem] py-[1rem] items-center grid grid-cols-4 ">
      <Box className="font-semibold">{event.name}</Box>
      <Box className="flex flex-col gap-[.2rem]">
        {event.type.toUpperCase()}
      </Box>
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">
          {isToday(new Date(event.startDate))
            ? "Today"
            : formatDistanceFromNow(event.startDate)}
        </span>
      </Box>

      <Link
        className="w-[80%] ml-auto h-[3.5rem] font-medium bg-[var(--color-primary)] text-[var(--color-grey-200)] rounded-2xl flex items-center justify-center"
        href={`/dashboard/events/${event._id}`}
      >
        Event
      </Link>
    </Box>
  );
}
