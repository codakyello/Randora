"use client";
import { Box } from "@chakra-ui/react";
import EventStats from "@/app/_components/EventStats";
import ParticipantTable from "@/app/_components/ParticipantTable";
import Menus from "@/app/_components/Menu";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import useEvent from "@/app/_hooks/useEvent";
import SpinnerFull from "./SpinnerFull";
import useEventPrizes from "../_hooks/useEventPrizes";
import { useAuth } from "../_contexts/AuthProvider";
import PrizeTable from "./PrizeTable";
import Modal from "./Modal";
import Button from "./Button";
import Tag from "./Tag";
import { getTagName } from "../_utils/helpers";
import useEventWinners from "../_hooks/useEventWinners";

export default function Event({ params }: { params: { eventId: string } }) {
  const { user } = useAuth();

  const { eventId } = params;

  const { data, isLoading } = useEvent(eventId);

  const { data: participantsData, isLoading: isParticipantsLoading } =
    useEventWinners(eventId);

  const { data: prizesData, isLoading: isPrizesLoading } =
    useEventPrizes(eventId);

  const event = data?.event;

  const participants = participantsData?.participants;

  const prizes = prizesData?.prizes;

  if (isLoading || isParticipantsLoading || isPrizesLoading)
    return <SpinnerFull />;

  const totalCount = participantsData?.totalCount;

  const creator = event?.creator;

  if (!event) return <h1 className="p-5">No Event Found </h1>;

  return (
    <Menus>
      <Modal>
        <Box className="flex pl-[2rem] flex-col gap-[3.2rem]">
          <Box className="flex justify-between items-center">
            <Box className="flex flex-col">
              <Box className="flex items-center gap-4">
                <h1 className="md:mb-0">{event.name}</h1>
                <Tag type={getTagName(event.status)}>{event.status}</Tag>
              </Box>
              <span className="text-[1.4rem] opacity-80">
                Created by{" "}
                <span className=" text-[var(--color-primary)] font-medium">
                  {creator?._id === user?._id ? "You" : creator?.userName}
                </span>
              </span>
            </Box>

            <Link href={`/lottery/raffle/${eventId}`}>
              <Button
                className="mr-[2rem] flex items-center gap-1"
                type="primary"
              >
                Lottery
                <MdArrowOutward />
              </Button>
            </Link>
          </Box>
          <Box className="grid pr-[2rem] min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
            <EventStats
              event={event}
              participants={participants}
              totalParticipants={totalCount}
              prizes={prizes}
            />
          </Box>
          {participants?.length > 0 ? (
            <Box className="space-y-5 mt-16">
              <div className="flex justify-between items-end">
                <h2>Participants</h2>
                <Link
                  href={`/dashboard/events/${eventId}/participants`}
                  className="font-semibold text-[1.4rem] flex items-center gap-3 text-[var(--color-primary)]"
                >
                  <Box className="pr-[2rem] flex items-center gap-3">
                    <span>View all</span>
                    <FaChevronRight />
                  </Box>
                </Link>
              </div>
              <ParticipantTable
                actions={false}
                participants={participants}
                count={5}
              />
            </Box>
          ) : (
            <Box className="flex flex-col mt-16 items-center justify-center">
              <h2>No participants yet</h2>
              <Link
                className="underline text-[var(--color-primary)]"
                href={`/dashboard/events/${eventId}/participants`}
              >
                Add Participants
              </Link>
            </Box>
          )}

          {prizes?.length > 0 ? (
            <Box className="space-y-5 mt-16">
              <div className="flex justify-between items-end">
                <h2>Prizes</h2>
                <Link
                  href={`/dashboard/events/${eventId}/prizes`}
                  className="font-semibold text-[1.4rem] flex items-center gap-3 text-[var(--color-primary)]"
                >
                  <Box className="pr-[2rem] flex items-center gap-3">
                    <span>View all</span>
                    <FaChevronRight />
                  </Box>
                </Link>
              </div>
              <PrizeTable
                actions={false}
                prizes={prizes?.slice(0, 5)}
                count={5}
              />
            </Box>
          ) : (
            <Box className="flex flex-col mt-16 items-center justify-center">
              <h2>No prizes yet</h2>
              <Link
                className="underline text-[var(--color-primary)]"
                href={`/dashboard/events/${eventId}/prizes`}
              >
                Add Prizes
              </Link>
            </Box>
          )}
        </Box>
      </Modal>
    </Menus>
  );
}
