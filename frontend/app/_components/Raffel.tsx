"use client";

import { useState, useEffect, useRef } from "react";
import JSConfetti from "js-confetti";
import { Box } from "@chakra-ui/react";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import { IoCloseOutline } from "react-icons/io5";
import { Event, Organisation, Participant, Prize } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import {
  assignPrize as assignPrizeApi,
  updateParticipant as updateParticipantApi,
  updateEvent as updateEventApi,
} from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
import RaffelPrizesList from "./RaffelPrizesList";
import { ChevronDown } from "lucide-react";

export default function Raffle({
  organisation,
  prizeData,
  event,
  participantData,
}: {
  organisation: Organisation;
  prizeData: Prize[];
  event: Event;
  participantData: Participant[];
}) {
  const [participants, setParticipants] = useState<Participant[]>(() =>
    participantData.filter((participant) => !participant.isWinner)
  );
  const [prizes, setPrizes] = useState<Prize[]>(prizeData);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [drumRoll, setDrumRoll] = useState<HTMLAudioElement | null>(null);
  const [crash, setCrash] = useState<HTMLAudioElement | null>(null);
  const { open: openModal, close } = useModal();
  const resetRef = useRef<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const { getToken } = useAuth();
  const token = getToken();

  const { mutate: updateParticipant } = useCustomMutation(updateParticipantApi);

  const { mutate: assignPrize } = useCustomMutation(assignPrizeApi);

  const { mutate: updateEvent } = useCustomMutation(updateEventApi);

  useEffect(() => {
    setDrumRoll(new Audio("/effects/drum-roll-sound-effect.mp3"));
    setCrash(new Audio("/effects/crash.mp3"));
  }, []);

  useEffect(() => {
    openModal("prizes");
  }, []);

  const wait = (seconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const availablePrizeCount = prizes.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );

  const pickWinner = async () => {
    console.log(selectedPrize);
    // send a post request to server to set event to active
    if (!selectedPrize) {
      toast.error("Please select a prize");
      return;
    }

    if (selectedPrize.quantity < 1) {
      toast.error("Choose a different prize!");
      return;
    }

    if (!active) {
      console.log("setting active");
      updateEvent(
        {
          eventId: event._id,
          eventData: { status: "active" },
          token,
        },
        {
          onSuccess: () => {
            setActive(true);
          },
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );
    }
    // send a request to update prize

    // send a request to update participant by setting isWinner to true
    if (isSpinning) return;

    if (availablePrizeCount === 0 || participants.length === 0) {
      toast.error("No more slots available!");
      return;
    }

    setIsSpinning(true);
    resetRef.current = false;

    if (drumRoll) drumRoll.play();

    let selectedParticipant: Participant | null = null;

    for (let i = 0; i < 55; i++) {
      if (resetRef.current) {
        resetGame();
        console.log("resetGame"); // Handle early reset
        return;
      }

      const randomParticipant =
        participants[Math.floor(Math.random() * participants.length)];

      setCurrentParticipant(randomParticipant);

      selectedParticipant = randomParticipant;

      await wait(0.1);
    }

    setIsSpinning(false);

    if (selectedParticipant && selectedPrize) {
      // Update participant state to remove the winner
      setParticipants((prevParticipants) =>
        prevParticipants.filter(
          (participant) => participant._id !== selectedParticipant._id
        )
      );

      // update participant with prizeId and set isWinner true in db
      updateParticipant(
        {
          participantId: selectedParticipant._id,
          participantForm: {
            isWinner: true,
            prizeId: selectedPrize._id,
          },
          token,
        },
        {
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );

      // Update prize state to reduce quantity
      setPrizes((prevPrizes) =>
        prevPrizes.map((prize) =>
          prize._id === selectedPrize._id
            ? { ...prize, quantity: prize.quantity - 1 }
            : prize
        )
      );

      setSelectedPrize(null);
      setPrizeWon(selectedPrize.name);

      assignPrize(
        {
          prizeId: selectedPrize._id,
          participantId: selectedParticipant._id,
          token,
        },
        {
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );

      if (crash) crash.play();

      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        confettiColors: ["#0634f0", "#5171f5", "#ff7096", "#fb8500", "#f9bec7"],
      });

      // Open the modal with the final values
      setWinner(selectedParticipant);
      setCurrentParticipant(null);

      // setCurrentPrize(selectedPrize);
      openModal("showWinner");
    }
  };

  const resetGame = () => {
    resetRef.current = true;
    setIsSpinning(false);
    setCurrentParticipant(null);
    setSelectedPrize(null);

    if (drumRoll) {
      drumRoll.pause();
      drumRoll.currentTime = 0;
    }
  };

  return (
    <Box
      className="bg-[var(--color-grey-50)] min-h-screen lottery-app flex flex-col gap-4 justify-between items-center"
      style={{
        ["--brand-color" as string]:
          organisation?.brandColor || "var(--color-primary)",
      }}
    >
      <Box className="text-[1.6rem] top-[12rem] left-[5rem] absolute">
        {availablePrizeCount}
      </Box>
      <Box className="flex min-h-screen py-[7rem] flex-col gap-4 justify-between items-center">
        <Box className="flex flex-col gap-4 mt-[2rem] items-center">
          <img
            src={organisation?.textLogo || "/randora-text.png"}
            alt="logo"
            className="h-[7.5rem]"
          />

          <p className="font-semibold uppercase text-[var(--color-grey-600)] text-center leading-[2rem]   text-[1.5rem] w-[25rem]">
            {event.name}
          </p>

          <ModalOpen name="prizes">
            <Box className="text-[1.6rem] font-semibold mt-[2.5rem] rounded-2xl bg-[var(--brand-color)] text-white cursor-pointer p-[.5rem] px-[1rem] flex items-center gap-2">
              {selectedPrize ? selectedPrize.name : "Select Prize"}
              <ChevronDown className="w-[2rem] h-[2rem]" />
            </Box>
          </ModalOpen>
        </Box>
        <Box className="jack-box">
          {currentParticipant ? (
            <h1 className="text-[15rem]">{currentParticipant.ticketNumber}</h1>
          ) : (
            <img
              className="jack h-[27rem]"
              src={organisation?.coverLogo || "/randora-cover.png"}
              alt="Jackpot"
            />
          )}
        </Box>
        <Box className="flex gap-4">
          <button
            className="font-semibold w-[15rem] py-[1.2rem] px-[2rem] bg-[var(--brand-color)] text-white rounded-2xl"
            onClick={pickWinner}
          >
            Pick a winner
          </button>

          <button
            className="py-[1rem] px-[2rem] font-semibold border-2 border-[var(--brand-color)] text-[var(--brand-color)] rounded-2xl"
            onClick={resetGame}
          >
            Reset
          </button>
        </Box>
      </Box>

      <ModalWindow name="showWinner">
        <Box className="flex relative w-full max-w-[50rem] flex-col  bg-[var(--color-grey-0)] p-[4rem] rounded-xl items-center gap-8">
          <button
            onClick={() => {
              close();
              resetGame();
            }}
            className="absolute right-10 top-10"
          >
            <IoCloseOutline className="text-[3rem]" />
          </button>
          <Box className="flex flex-col items-center">
            <h2 className="text-[2.4rem] font-bold text-[var(--brand-color)]">
              Congratulations!
            </h2>
          </Box>

          <Box className="flex flex-col items-center gap-2">
            <p className="font-medium">Winning Ticket</p>
            <h1 className="text-[10rem] text-[var(--color-grey-700)]">
              {winner?.ticketNumber}
            </h1>
          </Box>

          <Box className="flex flex-col items-center gap-2 bg-[#f8f9ff] p-6 rounded-lg w-full">
            <p className=" text-[#333]">Prize Won</p>

            <p className="text-[3rem] uppercase font-semibold text-[#333]">
              {prizeWon}
            </p>
          </Box>
        </Box>
      </ModalWindow>

      <ModalWindow name="prizes">
        <Box className="bg-[var(--color-grey-0)] rounded-2xl  h-[50rem] border-l border-l-[var(--color-grey-100)] w-full overflow-y-scroll p-[3rem] space-y-6">
          <Box className="flex justify-between items-center">
            <h2>Select a prize</h2>

            <button
              onClick={() => {
                close();
              }}
              className="absolute right-10 top-10"
            >
              <IoCloseOutline className="text-[3rem]" />
            </button>
          </Box>

          <RaffelPrizesList
            prizes={prizes}
            setSelectedPrize={setSelectedPrize}
          />
        </Box>
      </ModalWindow>
    </Box>
  );
}
