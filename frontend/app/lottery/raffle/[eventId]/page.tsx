import Modal from "@/app/_components/Modal";
import Raffle from "@/app/_components/Raffel";
import {
  getAllEventPrizes,
  getEvent,
  getOrganisation,
  getEventParticipants,
} from "@/app/_lib/data-service";
import { Box } from "@chakra-ui/react";
// import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

//serverless function cannot run for more than 30 seconds
export default async function Page({
  params,
}: {
  params: { eventId: string };
}) {
  const [eventData, prizesData, participantsData] = await Promise.all([
    getEvent(params.eventId),
    getAllEventPrizes(params.eventId),
    getEventParticipants(params.eventId, { limit: 10 }),
  ]);

  console.log(prizesData?.prizes);

  const { event, statusCode } = eventData || {};
  const { prizes } = prizesData || {};
  const { totalCount: participantsCount } = participantsData || {};

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
        {participantsCount === 0 && (
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

        {participantsCount &&
          prizes?.length > 0 &&
          event.status !== "completed" && (
            <Raffle
              organisation={organisation}
              prizeData={prizes}
              event={event}
            />
          )}
      </Box>
    </Modal>
  );
}
