"use client";

import { useState, useEffect, useRef } from "react";
import JSConfetti from "js-confetti";
import { Box } from "@chakra-ui/react";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import { IoCloseOutline } from "react-icons/io5";
import {
  Event,
  Organisation,
  Participant,
  Prize,
  Winner,
} from "../_utils/types";
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
import Image from "next/image";
import { DownloadIcon } from "@chakra-ui/icons";
import LotteryNav from "./LotteryNav";

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
  console.log(event);
  console.log(participantData);
  const [participants, setParticipants] = useState<Participant[]>(() =>
    participantData.filter((participant) => !participant.isWinner)
  );
  const [prizes, setPrizes] = useState<Prize[]>(prizeData);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizeWon, setPrizeWon] = useState<Prize>();
  const [winner, setWinner] = useState<Participant | null>(null);
  const [prizeWinners, setprizeWinners] = useState<Participant[]>([]);
  const [allWinners, setAllWinners] = useState<Winner[]>(() =>
    participantData
      .filter((participant) => participant.isWinner)
      .map((participant) => ({
        ticketNumber: participant.ticketNumber,
        prize: participant.prize?.name,
        image: participant.prize?.image,
      }))
  );
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

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const wait = (seconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const availablePrizeCount = prizes.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );

  const canStart = () => {
    if (!isOnline) {
      toast.error("You are offline. Please check your network connection.");
      return;
    }
    // send a post request to server to set event to active
    if (!selectedPrize) {
      toast.error("Please select a prize");
      return false;
    }

    if (selectedPrize.quantity < 1) {
      toast.error("Choose a different prize!");
      return false;
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

    // send a request to update participant by setting isWinner to true
    if (isSpinning) return false;

    if (availablePrizeCount === 0 || participants.length === 0) {
      toast.error("No more slots available!");
      return false;
    }

    setIsSpinning(true);
    resetRef.current = false;

    return true;
  };

  const pickWinner = async () => {
    console.log(allWinners);
    if (!canStart()) return;

    if (drumRoll) drumRoll.play();

    let selectedParticipant: Participant | null = null;

    for (let i = 0; i < 55; i++) {
      if (resetRef.current) {
        resetGame();
        return;
      }

      const randomParticipant =
        participants[Math.floor(Math.random() * participants.length)];

      setCurrentParticipant(randomParticipant);

      selectedParticipant = randomParticipant;

      await wait(0.1);
    }

    setIsSpinning(false);

    if (selectedParticipant && selectedPrize)
      setAllWinners((prevWinners) => [
        ...prevWinners,
        {
          ticketNumber: selectedParticipant.ticketNumber,
          prize: selectedPrize.name,
          image: selectedPrize.image,
        },
      ]);

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
      setPrizeWon(selectedPrize);

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
      function launchConfetti(duration = 2000) {
        const interval = setInterval(() => {
          jsConfetti.addConfetti({
            confettiColors: [
              "#0634f0",
              "#5171f5",
              "#ff7096",
              "#fb8500",
              "#f9bec7",
            ],
          });
        }, 250); // Add confetti every 500ms

        setTimeout(() => {
          clearInterval(interval); // Stop adding confetti after the duration
        }, duration);
      }

      launchConfetti(1500);

      // Open the modal with the final values
      setWinner(selectedParticipant);
      setCurrentParticipant(null);

      // setCurrentPrize(selectedPrize);
      openModal("showWinner");
    }
  };

  const pickAllWinners = async () => {
    // Check if the user is online

    if (!canStart()) return;

    // Start by emptying the winners
    setprizeWinners([]);

    resetRef.current = false;

    // Create local copies of state variables
    let localParticipants = [...participants];
    const localPrize = selectedPrize ? { ...selectedPrize } : null;
    const localWinners = [...prizeWinners];

    while (
      localPrize &&
      localPrize.quantity > 0 &&
      localParticipants.length > 0
    ) {
      if (drumRoll) drumRoll.play();
      if (resetRef.current) {
        resetGame();
        console.log("Game reset");
        return;
      }

      setIsSpinning(true);

      let selectedParticipant: Participant | null = null;

      // Simulate the spinning effect
      for (let i = 0; i < 8; i++) {
        if (resetRef.current) {
          resetGame();
          return;
        }

        const randomParticipant =
          localParticipants[
            Math.floor(Math.random() * localParticipants.length)
          ];
        setCurrentParticipant(randomParticipant);
        selectedParticipant = randomParticipant;
        await wait(0.05);
      }

      resetDrumRoll();

      if (selectedParticipant && localPrize) {
        // Remove the winner from local participants
        localParticipants = localParticipants.filter(
          (participant) => participant._id !== selectedParticipant?._id
        );

        // Update the participant in the database
        updateParticipant(
          {
            participantId: selectedParticipant._id,
            participantForm: {
              isWinner: true,
              prizeId: localPrize._id,
            },
            token,
          },
          {
            onError: (err) => {
              toast.error(err.message);
            },
          }
        );

        setPrizes((prevPrizes) =>
          prevPrizes.map((prize) =>
            prize._id === selectedPrize?._id
              ? { ...prize, quantity: prize.quantity - 1 }
              : prize
          )
        );

        // Add the winner to the winners list
        if (selectedParticipant && selectedPrize?.name && selectedPrize?._id) {
          setprizeWinners((prevprizeWinners) => [
            ...prevprizeWinners,
            {
              ...selectedParticipant,
              prize: {
                _id: selectedPrize._id,
                name: selectedPrize.name,
                image: selectedPrize.image,
                quantity: selectedPrize.quantity || 0, // Default quantity if missing
              },
            },
          ]);

          setAllWinners((prevWinners) => [
            ...prevWinners,
            {
              ticketNumber: selectedParticipant.ticketNumber,
              prize: selectedPrize.name,
              image: selectedPrize.image,
            },
          ]);
        }

        // Update the prize quantity locally
        localPrize.quantity -= 1;

        // Add the winner to the local winners list
        localWinners.push(selectedParticipant);

        // Assign the prize to the participant in the database
        assignPrize(
          {
            prizeId: localPrize._id,
            participantId: selectedParticipant._id,
            token,
          },
          {
            onError: (err) => {
              toast.error(err.message);
            },
          }
        );

        // Reflect changes in React state
        setParticipants(localParticipants);
        setSelectedPrize(localPrize);

        // Add a delay between winners
        await wait(1); // Adjust this for a better user experience
      }
    }
    setSelectedPrize(null);
    setCurrentParticipant(null);

    // Final cleanup or message
    setIsSpinning(false);

    if (localPrize?.quantity === 0) {
      toast.success("All prizes have been allocated!");
    } else if (localParticipants.length === 0) {
      toast.error("No more participants available.");
    }

    // Display the results
    openModal("showprizeWinners");
  };

  const resetDrumRoll = function () {
    if (drumRoll) {
      drumRoll.pause();
      drumRoll.currentTime = 0;
    }
  };

  const resetGame = () => {
    resetRef.current = true;
    setIsSpinning(false);
    setCurrentParticipant(null);
    setprizeWinners([]);
    setSelectedPrize(null);
    resetDrumRoll();
  };

  const downloadCSV = () => {
    // Convert participants to CSV
    const headers = ["Ticket Number", "Prize"];
    const rows = allWinners.map((winner) => [
      winner.ticketNumber,
      winner.prize,
    ]);

    // Combine headers and rows into a CSV string
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name}-${event.type.toLowerCase()}-winners.csv`;

    // Trigger the download
    a.click();

    // Cleanup the URL object
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const img = document.createElement("img");
    img.src = selectedPrize?.image || "";
  }, [selectedPrize]);

  return (
    <Box
      className="bg-[var(--color-grey-50)] min-h-screen lottery-app flex flex-col gap-4 justify-between items-center"
      style={{
        ["--brand-color" as string]:
          organisation?.brandColor &&
          organisation.subscriptionStatus !== "expired"
            ? organisation?.brandColor
            : "var(--color-primary)",
      }}
    >
      <LotteryNav numberOfWinners={allWinners.length} />

      <Box className="flex min-h-screen py-[7rem] flex-col gap-4 justify-between items-center">
        <Box className="flex flex-col gap-4 mt-[2rem] items-center">
          <img
            src={
              organisation?.textLogo &&
              organisation.subscriptionStatus !== "expired"
                ? organisation?.textLogo
                : "/randora-text.png"
            }
            alt="logo"
            className="h-[10rem]"
          />

          <p className="font-semibold uppercase text-[var(--color-grey-600)] text-center leading-[2rem]   text-[1.5rem] w-[25rem]">
            {event.name}
          </p>

          <ModalOpen name="prizes">
            <Box className="text-[1.6rem] font-semibold mt-[1.5rem] rounded-2xl bg-[var(--brand-color)] text-[var(--color-grey-50)] cursor-pointer p-[.5rem] px-[1rem] flex items-center gap-2">
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
              src={
                organisation?.coverLogo &&
                organisation.subscriptionStatus !== "expired"
                  ? organisation?.coverLogo
                  : "/randora-cover.png"
              }
              alt="Jackpot"
            />
          )}
        </Box>
        <Box className="flex gap-4">
          <button
            className="font-semibold text-[var(--color-grey-50)] w-[15rem] py-[1.2rem] px-[2rem] bg-[var(--brand-color)]  rounded-2xl"
            onClick={pickWinner}
          >
            Pick a winner
          </button>

          <button
            className="py-[1rem] px-[2rem] font-semibold border-2 border-[var(--brand-color)] text-[var(--brand-color)] rounded-2xl"
            onClick={pickAllWinners}
          >
            Pick all winners
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

          {/* <img src={prizeWon?.image} alt="image" className="w-full" /> */}

          {prizeWon && (
            <Box className="overflow-hidden rounded-2xl">
              <img
                src={prizeWon?.image}
                alt="Prize Image"
                className="w-[25rem]"
              />
            </Box>
          )}

          <Box className="flex flex-col items-center gap-2 bg-[#f8f9ff] p-6 rounded-lg w-full">
            <p className=" text-[#333]">Prize Won</p>

            <p className="text-[3rem] text-center uppercase font-semibold text-[#333]">
              {prizeWon?.name}
            </p>
          </Box>
        </Box>
      </ModalWindow>

      <ModalWindow name="showprizeWinners">
        <Box className="bg-[var(--color-grey-0)] rounded-2xl  h-[50rem] border-l border-l-[var(--color-grey-100)] w-full  p-[3rem]">
          <Box className="flex justify-between">
            <h2>All Winners for {prizeWinners[0]?.prize?.name}</h2>

            <button
              onClick={() => {
                close();
                resetGame();
              }}
              className="absolute right-10 top-10"
            >
              <IoCloseOutline className="text-[3rem]" />
            </button>
          </Box>
          <p className="mt-[1rem] text-[var(--color-grey-500)]">
            A total of {prizeWinners.length} participants were chosen at random
          </p>

          <Box className=" grid grid-cols-[repeat(3,1fr)] py-[1.2rem] gap-[2.4rem] mt-[1.8rem]">
            <Box>Ticket</Box>
            <Box className="text-center">Prize</Box>
            <Box className="text-center">Prize Image</Box>
          </Box>

          <Box className="h-[32rem] overflow-y-scroll">
            {prizeWinners && prizeWinners.length > 0 ? (
              prizeWinners.map((winner, index) => (
                <Box
                  key={index}
                  className="border-b border-[var(--color-grey-100)] grid grid-cols-[repeat(3,1fr)] h-[7rem] items-center gap-[2.4rem]"
                >
                  {/* Ticket Number */}
                  <Box className="flex font-semibold">
                    {winner.ticketNumber}
                  </Box>

                  {/* Prize Name */}
                  <Box className="flex text-center justify-center flex-col gap-[.2rem]">
                    {winner.prize.name || <span>&mdash;</span>}
                  </Box>

                  {/* Prize Image */}
                  {winner.prize.image ? (
                    <Box className="relative rounded-lg overflow-hidden mx-auto w-[8rem] aspect-[3/2]">
                      <Image
                        fill
                        src={winner.prize.image}
                        alt={`${winner.prize.name || "prize"} image`}
                      />
                    </Box>
                  ) : (
                    <Box className="flex justify-center items-center flex-col gap-[.2rem]">
                      &mdash;
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Box className="flex text-[2rem] h-[32rem] justify-center items-center">
                No winners yet.
              </Box>
            )}
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

      <ModalWindow name="show-winners">
        <Box className="bg-[var(--color-grey-0)] rounded-2xl h-[55rem] border-l border-l-[var(--color-grey-100)] w-full p-[3rem]">
          <Box className="flex justify-between">
            <h2>
              All Winners for {event.name} by {organisation.name}
            </h2>

            <button
              onClick={() => {
                close();
                resetGame();
              }}
              className="absolute right-10 top-10"
            >
              <IoCloseOutline className="text-[3rem]" />
            </button>
          </Box>

          {allWinners && allWinners.length > 0 ? (
            <>
              <Box className="flex justify-between">
                <p className="mt-[1rem] text-[var(--color-grey-500)]">
                  A total of {allWinners.length} participants were chosen at
                  random
                </p>
                <button
                  onClick={downloadCSV}
                  className={`mr-[2rem] text-white py-[1.2rem] rounded-2xl px-[1.5rem] bg-[var(--brand-color)] flex items-center gap-1`}
                >
                  Export
                  <DownloadIcon />
                </button>
              </Box>

              <Box className="grid grid-cols-[repeat(3,1fr)] py-[1.2rem] gap-[2.4rem] mt-[1.8rem]">
                <Box className="font-semibold">Ticket</Box>
                <Box className="text-center font-semibold">Prize</Box>
                <Box className="text-center font-semibold">Prize Image</Box>
              </Box>

              {/* Apply overflow scrolling and height to this container */}
              <Box className="overflow-y-scroll h-[35rem]">
                {allWinners.map((winner, index) => (
                  <Box
                    key={index}
                    className="border-b border-[var(--color-grey-100)] grid grid-cols-[repeat(3,1fr)] h-[7rem] items-center gap-[2.4rem]"
                  >
                    {/* Ticket Number */}
                    <Box className="flex font-semibold">
                      {winner.ticketNumber}
                    </Box>

                    {/* Prize Name */}
                    <Box className="flex text-center justify-center flex-col gap-[.2rem]">
                      {winner.prize || <span>&mdash;</span>}
                    </Box>

                    {/* Prize Image */}
                    {winner.image ? (
                      <Box className="relative rounded-xl overflow-hidden mx-auto w-[9rem] aspect-[3/2]">
                        <Image
                          fill
                          src={winner.image}
                          alt={`${winner.prize || "prize"} image`}
                        />
                      </Box>
                    ) : (
                      <Box className="flex justify-center items-center flex-col gap-[.2rem]">
                        &mdash;
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Box className="flex text-[2rem] h-[32rem] justify-center items-center">
              No winners yet.
            </Box>
          )}
        </Box>
      </ModalWindow>
    </Box>
  );
}
