import { Box } from "@chakra-ui/react";

import EventStats from "@/app/_components/EventStats";
import { Event, Participant } from "@/app/_utils/types";
import ParticipantTable from "@/app/_components/ParticipantTable";
import Menus from "@/app/_components/Menu";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export const metadata = {
  title: "Event",
};

const event: Event = {
  _id: "64e9f3c8b5a730001f4d2234", // Example MongoDB ObjectId
  name: "End of Year Boom",
  type: "Competition",
  status: "Active",
  emailSent: true,
  startDate: "2024-12-15T08:00:00.000Z",
  endDate: "2024-12-25T18:00:00.000Z",
  participantCount: 500,
  prizeCount: 10,
  remainingPrize: 4,
};

const participants: Participant[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "johndoe@example.com",
    ticketNumber: "A123",
    isWinner: true,
    prize: {
      name: "Smartphone",
      image: "https://unsplash.it/300/300?image=1", // Placeholder image for smartphone
    },
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "janesmith@example.com",
    ticketNumber: "B456",
    isWinner: false,
    prize: {
      name: "",
      image: "", // No prize for non-winners
    },
  },
  {
    _id: "3",
    name: "Alice Brown",
    email: "alicebrown@example.com",
    ticketNumber: "C789",
    isWinner: true,
    prize: {
      name: "Laptop",
      image: "https://unsplash.it/300/300?image=2", // Placeholder image for laptop
    },
  },
  {
    _id: "4",
    name: "Bob Green",
    email: "bobgreen@example.com",
    ticketNumber: "D012",
    isWinner: false,
    prize: {
      name: "",
      image: "", // No prize for non-winners
    },
  },
  {
    _id: "5",
    name: "Charlie White",
    email: "charliewhite@example.com",
    ticketNumber: "E345",
    isWinner: true,
    prize: {
      name: "Gift Card",
      image: "https://unsplash.it/300/300?image=3", // Placeholder image for gift card
    },
  },
];

async function EventPage({ params }: { params: { eventId: string } }) {
  // const data = await getAllCabins();
  // const cabinCount = data.totalCount;
  const { eventId } = params;

  console.log(eventId);

  return (
    <Box className="flex px-[2rem] flex-col gap-[3.2rem]">
      <Box className="flex flex-col md:flex-row justify-between space-y-3">
        <h1 className="md:mb-0">{event.name}</h1>
        <div className="flex gap-8 opacity-80">
          <span>Creator: Jane Doe</span> <span className="opacity-50">|</span>
          <span>Owner: JasmondWorks</span>
        </div>
      </Box>
      <Box className="grid min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        <EventStats event={event} />
      </Box>
      <Box className="space-y-5 mt-16">
        <Menus>
          <div className="flex justify-between items-end">
            <h2>Participants</h2>
            <Link
              href="/dashboard/participants"
              className="font-semibold text-[1.4rem] flex items-center gap-3 text-[var(--color-primary)]"
            >
              <span>View more</span>
              <FaChevronRight />
            </Link>
          </div>
          <ParticipantTable participants={participants.slice(0, 5)} count={5} />
        </Menus>
      </Box>
    </Box>
  );
}

export default EventPage;
