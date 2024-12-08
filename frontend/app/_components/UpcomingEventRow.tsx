import { Box } from "@chakra-ui/react";
import { Event } from "../_utils/types";
import { isToday } from "date-fns";
import { formatDistanceFromNow } from "../_utils/helpers";
import Link from "next/link";

export default function UpcomingEventRow({ event }: { event: Event }) {
  return (
    <Link
      href={`/dashboard/events/${event._id}`}
      className="cursor-pointer border-b hover:border-[#bab9ff] transition-colors duration-300 border-[var(--color-grey-100)] gap-x-[2rem] py-[1.5rem] items-center grid grid-cols-3"
    >
      <Box className="">{event.name}</Box>
      <Box className="flex items-center font-semibold text-[1.2rem] flex-col gap-[.2rem]">
        {event.type.toUpperCase()}
      </Box>
      <Box className="ml-auto">
        <span className="font-medium">
          {isToday(new Date(event.startDate))
            ? "Today"
            : formatDistanceFromNow(event.startDate)}
        </span>
      </Box>
      {/* <Link
        className="w-[80%] ml-auto h-[3.5rem] font-medium bg-[var(--color-primary)] text-[var(--color-grey-200)] rounded-2xl flex items-center justify-center"
        `}
      >
        Event
      </Link> */}
      {/* color: var(--color-grey-600); background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-200); */}
    </Link>
  );
}
