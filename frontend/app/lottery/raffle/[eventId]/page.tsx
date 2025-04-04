import Modal from "@/app/_components/Modal";
import Raffle from "@/app/_components/Raffel";
import {
  getAllEventPrizes,
  getEvent,
  getOrganisation,
  getEventParticipants,
} from "@/app/_lib/data-service";
import { Participant } from "@/app/_utils/types";
import { Box } from "@chakra-ui/react";
// import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { eventId: string };
}) {
  const [eventData, prizesData] = await Promise.all([
    getEvent(params.eventId),
    getAllEventPrizes(params.eventId),
  ]);

  console.log(prizesData?.prizes);

  // The backend cannot have a
  // long running task of more than 10 seconds
  let page = 1;
  const limit = 10000;

  const participants: Participant[] = [];

  while (true) {
    console.log("in here");
    const res = await getEventParticipants(params.eventId, {
      limit,
      page,
    });

    if (!res?.participants || !Array.isArray(res.participants)) break; // Ensure participants exist

    participants.push(...res?.participants);
    page++;

    console.log(participants.length, page);
    if (res?.participants.length < limit || participants.length > 49999) break;
  }

  const { event, statusCode } = eventData || {};
  const { prizes } = prizesData || {};

  const organisation = await getOrganisation(event?.organisationId);

  if (statusCode === 404) return notFound();

  if (!event)
    return (
      <Box className="h-screen bg-[var(--color-grey-50)] flex items-center justify-center text-center text-[1.5rem] font-semibold">
        <h1 className="text-[4rem]">Event not Found</h1>

        <Link
          className="absolute flex items-center left-5 top-[4rem] text-[1.6rem] font-semibold"
          href={`/dashboard/events/${event?._id}`}
        >
          <ChevronLeftIcon className="text-[2rem]" />
          <p className="text-[var(--brand-color)]">Go Back</p>
        </Link>
      </Box>
    );

  // if (new Date(event.startDate) > new Date())
  //   return (
  //     <Box className="h-screen bg-[var(--color-grey-0)] flex items-center justify-center text-center text-[1.5rem] font-semibold">
  //       <h1 className="text-[3rem]">
  //         Event starts in {formatDistanceToNow(new Date(event.startDate))}
  //       </h1>

  //       <Link
  //         className="absolute flex items-center left-5 top-[4rem] text-[#0634f0] text-[1.6rem] font-semibold"
  //         href={`/dashboard/events/${event._id}`}
  //       >
  //         <ChevronLeftIcon className="text-[2rem]" />
  //         <p className="text-[var(--brand-color)]">Go Back</p>
  //       </Link>
  //     </Box>
  //   );

  return (
    <Modal>
      <Box className="bg-[var(--color-grey-0)]">
        {participants?.length === 0 && (
          <Box className="h-screen bg-[var(--color-grey-50)] flex items-center justify-center text-center text-[1.5rem] font-semibold">
            <h1 className="text-[3rem]">
              Please Add participants to this event
            </h1>
          </Box>
        )}

        {prizes?.length === 0 && (
          <Box className="h-screen bg-[var(--color-grey-50)] flex items-center justify-center text-center text-[1.5rem] font-semibold">
            <h1 className="text-[3rem]">Please Add prizes to this event</h1>
          </Box>
        )}

        {event?.status === "completed" && (
          <Box className="h-screen bg-[var(--color-grey-50)] flex items-center justify-center text-center text-[1.5rem] font-semibold">
            <h1 className="text-[3rem]">This event is completed</h1>
          </Box>
        )}

        <Link
          className="absolute flex items-center left-5 top-[8rem]  text-[1.6rem] font-semibold"
          href={`/dashboard/events/${event._id}`}
        >
          <ChevronLeftIcon className="text-[2rem]" />
          <p className="text-[var(--brand-color)]">Go Back</p>
        </Link>

        {participants?.length > 0 &&
          prizes?.length > 0 &&
          event.status !== "completed" && (
            <Raffle
              organisation={organisation}
              prizeData={prizes}
              event={event}
              participantData={participants}
            />
          )}
      </Box>
    </Modal>
  );
}
