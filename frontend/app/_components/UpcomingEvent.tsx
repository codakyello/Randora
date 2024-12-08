import { Box } from "@chakra-ui/react";
import UpcomingEventRow from "./UpcomingEventRow";
import { Event } from "../_utils/types";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

export default function UpcomingEvents({
  upcomingEvents,
}: {
  upcomingEvents: Event[];
}) {
  return (
    <Box className="max-h-[36rem] min-h-full no-scrollbar overflow-y-auto flex flex-col gap-[1.6rem] bg-[var(--color-grey-0)] p-[2rem]  gap-x-[1.6rem] rounded-2xl">
      <Box className="flex justify-between items-center">
        <h2>Upcoming events</h2>
        <Link
          href={`/dashboard/events`}
          className="font-semibold text-[1.4rem] flex items-center gap-3 text-[var(--color-primary)]"
        >
          <span>View all</span>
          <FaChevronRight />
        </Link>
      </Box>
      <Box>
        {upcomingEvents.map((event) => (
          <UpcomingEventRow key={event._id} event={event} />
        ))}
      </Box>
    </Box>
  );
}
