"use client";
import { Box } from "@chakra-ui/react";
import EventStats from "@/app/_components/EventStats";
import ParticipantTable from "@/app/_components/ParticipantTable";
import Menus from "@/app/_components/Menu";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import useEvent from "@/app/_hooks/useEvent";
import SpinnerFull from "./SpinnerFull";
import useEventPrizes from "../_hooks/useEventPrizes";
import useEventAllParticipants from "../_hooks/useEventAllParticipants";
import { useAuth } from "../_contexts/AuthProvider";
import PrizeTable from "./PrizeTable";
import Modal from "./Modal";

export default function Event({ params }: { params: { eventId: string } }) {
  const { user } = useAuth();

  const { eventId } = params;

  const { data, isLoading } = useEvent(eventId);

  const { data: participantsData, isLoading: isParticipantsLoading } =
    useEventAllParticipants(eventId);

  const { data: prizesData, isLoading: isPrizesLoading } =
    useEventPrizes(eventId);

  const event = data?.event;
  const participants = participantsData?.participants;
  const prizes = prizesData?.prizes;

  console.log(prizes);
  const totalCount = participantsData?.totalCount;

  const creator = event?.creator;

  if (isLoading || isParticipantsLoading || isPrizesLoading)
    return <SpinnerFull />;

  return (
    <Menus>
      <Modal>
        <Box className="flex px-[2rem] flex-col gap-[3.2rem]">
          <Box className="flex flex-col md:flex-row justify-between space-y-1">
            <h1 className="md:mb-0">{event.name}</h1>
            <div className="flex gap-8 opacity-80 text-[1.4rem]">
              <span>
                Created by{" "}
                <span className=" text-[var(--color-primary)]">
                  {creator?._id === user?._id ? "You" : creator?.userName}
                </span>
              </span>
            </div>
          </Box>
          <Box className="grid min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
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
                  <span>View all</span>
                  <FaChevronRight />
                </Link>
              </div>
              <ParticipantTable
                actions={false}
                participants={participants?.slice(0, 5)}
                count={5}
              />
            </Box>
          ) : (
            <Box className="flex flex-col mt-16 items-center justify-center">
              <h2>No participants yet</h2>
              <Link
                className="text-[var(--color-primary)]"
                href={`/dashboard/events/${eventId}/participants`}
              >
                Add Participants
              </Link>

              {!prizes?.length && (
                <Box className=" flex-col flex items-center mt-16">
                  <h2>No prizes yet</h2>
                  <Link
                    className="text-[var(--color-primary)]"
                    href={`/dashboard/events/${eventId}/prizes`}
                  >
                    Add Prizes
                  </Link>
                </Box>
              )}
            </Box>
          )}

          {prizes?.length > 0 && (
            <Box className="space-y-5 mt-16">
              <div className="flex justify-between items-end">
                <h2>Prizes</h2>
                <Link
                  href={`/dashboard/events/${eventId}/prizes`}
                  className="font-semibold text-[1.4rem] flex items-center gap-3 text-[var(--color-primary)]"
                >
                  <span>View all</span>
                  <FaChevronRight />
                </Link>
              </div>
              <PrizeTable
                actions={false}
                prizes={prizes?.slice(0, 5)}
                count={5}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Menus>
  );
}
