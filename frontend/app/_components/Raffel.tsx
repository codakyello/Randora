"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import JSConfetti from "js-confetti";
import { Box } from "@chakra-ui/react";
import { ModalOpen, ModalWindow, useModal } from "./Modal";
import { IoCloseOutline } from "react-icons/io5";
import { Event, Organisation, Participant, Prize } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import {
  assignPrize as assignPrizeApi,
  updateEvent as updateEventApi,
} from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";
import RaffelPrizesList from "./RaffelPrizesList";
import { ChevronDown } from "lucide-react";
import { DownloadIcon } from "@chakra-ui/icons";
import LotteryNav from "./LotteryNav";
import Menus from "./Menu";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getEventParticipants } from "../_lib/data-service";
import SpinnerFull from "./SpinnerFull";

type AssignPrizeVariables = {
  prizeId: string;
  participantId: string;
  token: string | null;
};

export default function Raffle({
  organisation,
  prizeData,
  event,
}: {
  organisation: Organisation;
  prizeData: Prize[];
  event: Event;
}) {
  // const [participants, setParticipants] = useState<Participant[]>(() =>
  //   participantData.filter((participant) => !participant.isWinner)
  // );

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isFetchingParticipants, setIsFetchingParticipants] = useState(true);
  const [prizes, setPrizes] = useState<Prize[]>(prizeData);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizeWon, setPrizeWon] = useState<Prize>();
  const [winner, setWinner] = useState<Participant | null>(null);
  const [prizeWinners, setprizeWinners] = useState<Participant[]>([]);
  const [allWinners, setAllWinners] = useState<Participant[]>([]);
  const [drumRoll, setDrumRoll] = useState<HTMLAudioElement | null>(null);
  const [crash, setCrash] = useState<HTMLAudioElement | null>(null);
  const { open: openModal, close } = useModal();
  const resetRef = useRef<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const { getToken } = useAuth();
  const token = getToken();

  // const { mutate: updateParticipant } = useCustomMutation(updateParticipantApi);

  const { mutateAsync: assignPrize } = useCustomMutation<
    Participant,
    AssignPrizeVariables
  >(assignPrizeApi);

  const { mutate: updateEvent } = useCustomMutation(updateEventApi);

  console.log(allWinners.length, participants.length);
  const fetchEventParticipants = useCallback(
    async ({ showLoader = false }: { showLoader?: boolean } = {}) => {
      if (showLoader) setIsFetchingParticipants(true);

      try {
        let page = 1;
        const limit = 10000;
        const updatedParticipants: Participant[] = [];
        const updatedWinners: Participant[] = [];

        while (true) {
          const res = await getEventParticipants(event._id, {
            limit,
            page,
          });

          if (!res?.participants || !Array.isArray(res.participants)) {
            toast.error(
              "All participants couldn't be fetched. Please refresh the page."
            );
            break;
          }

          const filteredParticipants = res.participants.filter(
            (participant) => !participant.isWinner
          );
          const winnersList = res.participants.filter(
            (participant) => participant.isWinner
          );

          updatedParticipants.push(...filteredParticipants);
          updatedWinners.push(...winnersList);

          if (res.participants.length < limit) break;

          page++;
        }

        setParticipants(updatedParticipants);
        setAllWinners(updatedWinners);
      } catch (error) {
        toast.error("Could not refresh participants. Please try again.");
      } finally {
        if (showLoader) setIsFetchingParticipants(false);
      }
    },
    [event._id]
  );

  useEffect(() => {
    fetchEventParticipants({ showLoader: true }).then(() =>
      console.log("fetch finished")
    );
  }, [fetchEventParticipants]);

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

  const applyWinnerLocally = useCallback(
    (participant: Participant, fallbackPrizeId?: string) => {
      setAllWinners((prevWinners) => [...prevWinners, participant]);
      setParticipants((prevParticipants) =>
        prevParticipants.filter(
          (prevParticipant) => prevParticipant._id !== participant._id
        )
      );
      setPrizes((prevPrizes) =>
        prevPrizes.map((prevPrize) =>
          prevPrize._id === (participant.prize?._id || fallbackPrizeId)
            ? {
                ...prevPrize,
                quantity: Math.max(prevPrize.quantity - 1, 0),
              }
            : prevPrize
        )
      );
    },
    []
  );

  const revertWinnerAssignment = useCallback(
    ({
      optimistic,
      original,
      prizeId,
    }: {
      optimistic: Participant;
      original: Participant;
      prizeId?: string;
    }) => {
      setAllWinners((prevWinners) =>
        prevWinners.filter((winner) => winner._id !== optimistic._id)
      );
      setprizeWinners((prevWinners) =>
        prevWinners.filter((winner) => winner._id !== optimistic._id)
      );
      setParticipants((prevParticipants) => [...prevParticipants, original]);
      setPrizes((prevPrizes) =>
        prevPrizes.map((prevPrize) =>
          prevPrize._id === prizeId
            ? { ...prevPrize, quantity: prevPrize.quantity + 1 }
            : prevPrize
        )
      );
    },
    []
  );

  const syncWinnerDetails = useCallback((participant: Participant) => {
    setAllWinners((prevWinners) =>
      prevWinners.map((winner) =>
        winner._id === participant._id ? participant : winner
      )
    );
    setprizeWinners((prevWinners) =>
      prevWinners.map((winner) =>
        winner._id === participant._id ? participant : winner
      )
    );
  }, []);

  const assignPrizeWithOptimism = useCallback(
    (
      {
        optimistic,
        original,
        prizeId,
        onSuccess,
        onError,
      }: {
        optimistic: Participant;
        original: Participant;
        prizeId: string;
        onSuccess?: (participant: Participant) => void;
        onError?: () => void;
      }
    ) => {
      assignPrize({
        prizeId,
        participantId: optimistic._id,
        token,
      })
        .then((participant) => {
          syncWinnerDetails(participant);
          onSuccess?.(participant);
          fetchEventParticipants();
        })
        .catch((error) => {
          revertWinnerAssignment({
            optimistic,
            original,
            prizeId,
          });
          onError?.();
          const message =
            error instanceof Error
              ? error.message
              : "Could not assign prize. Please try again.";
          toast.error(message);
        });
    },
    [
      assignPrize,
      token,
      syncWinnerDetails,
      revertWinnerAssignment,
      fetchEventParticipants,
    ]
  );

  const canStart = () => {
    if (new Date(event.startDate) > new Date()) {
      toast.error(
        `Event starts in ${formatDistanceToNow(new Date(event.startDate))}`
      );
      return false;
    }

    if (event.remainingPrize < 1) {
      toast.error("No Prizes left to distribute");
      return false;
    }
    if (!isOnline) {
      toast.error("You are offline. Please check your network connection.");
      return false;
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

    if (selectedParticipant && selectedPrize) {
      const optimisticParticipant: Participant = {
        ...selectedParticipant,
        prize: selectedPrize,
        isWinner: true,
      };

      applyWinnerLocally(optimisticParticipant, selectedPrize._id);

      assignPrizeWithOptimism({
        optimistic: optimisticParticipant,
        original: selectedParticipant,
        prizeId: selectedPrize._id,
        onSuccess: (participant) => {
          setWinner(participant);
          setPrizeWon(participant.prize);
        },
        onError: () => {
          resetDrumRoll();
          setIsSpinning(false);
          close();
          setWinner(null);
          setPrizeWon(undefined);
        },
      });

      setSelectedPrize(null);
      setPrizeWon(selectedPrize);

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
      setWinner(optimisticParticipant);
      setCurrentParticipant(null);

      // setCurrentPrize(selectedPrize);
      openModal("showWinner");
    }
  };

  const pickAllWinners = async () => {
    // Check if the user is online

    // Start by emptying the winners
    setprizeWinners([]);

    resetRef.current = false;

    // Create local copies of state variables
    let localParticipants = [...participants];
    const localPrize = selectedPrize ? { ...selectedPrize } : null;
    const winnersThisRound: Participant[] = [];

    while (
      localPrize &&
      localPrize.quantity > 0 &&
      localParticipants.length > 0
    ) {
      if (!isOnline) {
        toast.error("You are offline. Please check your network connection.");
        return;
      }
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
        if (!isOnline) {
          toast.error("You are offline. Please check your network connection.");
          return;
        }

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

        // Update the prize quantity locally
        localPrize.quantity -= 1;

        const optimisticParticipant: Participant = {
          ...selectedParticipant,
          prize: { ...localPrize },
          isWinner: true,
        };

        winnersThisRound.push(optimisticParticipant);
        setprizeWinners([...winnersThisRound]);
        applyWinnerLocally(optimisticParticipant, localPrize._id);

        assignPrizeWithOptimism({
          optimistic: optimisticParticipant,
          original: selectedParticipant,
          prizeId: localPrize._id,
          onError: () => {
            localPrize.quantity += 1;
            localParticipants.push(selectedParticipant);
            const winnerIndex = winnersThisRound.findIndex(
              (winner) => winner._id === optimisticParticipant._id
            );
            if (winnerIndex > -1) {
              winnersThisRound.splice(winnerIndex, 1);
              setprizeWinners([...winnersThisRound]);
            }
            resetDrumRoll();
            setIsSpinning(false);
            setSelectedPrize({ ...localPrize });
          },
        });

        setSelectedPrize({ ...localPrize });

        // Add a delay between winners
        await wait(2.2); // Adjust this for a better user experience
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

    fetchEventParticipants();
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
    const headers = ["Name", "Email", "Ticket Number", "Prize"];

    const rows = allWinners.map((winner) => [
      winner.name,
      winner.email,
      winner.ticketNumber,
      winner.prize.name,
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

  if (isFetchingParticipants) return <SpinnerFull />;
  return (
    <Menus>
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
              className="h-[9rem]"
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
          <Box className="jack-box max-w-[50rem]">
            {currentParticipant ? (
              <h1
                className={`${
                  Boolean(Number(currentParticipant.ticketNumber))
                    ? "text-[15rem]"
                    : "text-[5rem]"
                } leading-none`}
              >
                {currentParticipant.ticketNumber}
              </h1>
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
              disabled={isSpinning}
              className="font-semibold text-[var(--color-grey-50)] w-[15rem] py-[1.2rem] px-[2rem] bg-[var(--brand-color)]  rounded-2xl"
              onClick={pickWinner}
            >
              Pick a winner
            </button>

            <button
              disabled={isSpinning}
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
              <h2 className="text-[2.4rem] text-center font-bold text-[var(--brand-color)]">
                Congratulations {winner?.name || ""}🎉🎉
              </h2>
            </Box>

            <Box className="flex flex-col items-center gap-2">
              <p className="font-medium">Winning Ticket</p>
              <h1
                className={`${
                  Boolean(Number(winner?.ticketNumber))
                    ? "text-[10rem] "
                    : "text-[5rem] "
                }text-center w-[45rem] leading-none text-[var(--color-grey-700)]`}
              >
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
          <Box className="relative bg-[var(--color-grey-0)] rounded-2xl  h-[50rem] border-l border-l-[var(--color-grey-100)] w-full  p-[3rem]">
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
              A total of {prizeWinners.length} participants were chosen at
              random
            </p>

            <Box className=" grid grid-cols-[repeat(5,1fr)] py-[1.2rem] gap-[2.4rem] mt-[1.8rem]">
              <Box>Name</Box>
              <Box>Email</Box>
              <Box>Ticket</Box>
              <Box className="text-center">Prize</Box>
              <Box className="text-center">Prize Image</Box>
            </Box>

            <Box className="h-[32rem] overflow-y-scroll">
              {prizeWinners && prizeWinners.length > 0 ? (
                prizeWinners.map((winner, index) => (
                  <Box
                    key={index}
                    className="border-b border-[var(--color-grey-100)] grid grid-cols-[repeat(5,1fr)] h-[7rem] items-center gap-[2.4rem]"
                  >
                    {/* {Name} */}
                    <Box>
                      {winner?.name || <span className="ml-4">&mdash;</span>}
                    </Box>
                    {/* {Email} */}
                    <Box>
                      {winner?.email || <span className="ml-4">&mdash;</span>}
                    </Box>
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
          <Box className="bg-[var(--color-grey-0)] relative  rounded-2xl  h-[50rem] border-l border-l-[var(--color-grey-100)] max-w-[80rem] w-full overflow-y-scroll p-[3rem] space-y-6">
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
          <Box className="bg-[var(--color-grey-0)] relative rounded-2xl h-[55rem] border-l border-l-[var(--color-grey-100)] max-w-[80rem] w-full p-[3rem]">
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

                <Box className=" grid grid-cols-[repeat(5,1fr)] py-[1.2rem] gap-[2.4rem] mt-[1.8rem]">
                  <Box>Name</Box>
                  <Box>Email</Box>
                  <Box>Ticket</Box>
                  <Box className="text-center">Prize</Box>
                  <Box className="text-center">Prize Image</Box>
                </Box>

                {/* Apply overflow scrolling and height to this container */}
                <Box className="h-[32rem] overflow-y-scroll">
                  {allWinners && allWinners.length > 0 ? (
                    allWinners.map((winner, index) => (
                      <Box
                        key={index}
                        className="border-b border-[var(--color-grey-100)] grid grid-cols-[repeat(5,1fr)] h-[7rem] items-center gap-[2.4rem]"
                      >
                        {/* {Name} */}
                        <Box>
                          {winner?.name || (
                            <span className="ml-4">&mdash;</span>
                          )}
                        </Box>
                        {/* {Email} */}
                        <Box>
                          {winner?.email || (
                            <span className="ml-4">&mdash;</span>
                          )}
                        </Box>
                        {/* Ticket Number */}
                        <Box className="flex font-semibold">
                          {winner?.ticketNumber}
                        </Box>

                        {/* Prize Name */}
                        <Box className="flex text-center justify-center flex-col gap-[.2rem]">
                          {winner.prize.name || <span>&mdash;</span>}
                        </Box>

                        {/* Prize Image */}
                        {winner.prize?.image ? (
                          <Box className="relative rounded-lg overflow-hidden mx-auto w-[8rem] aspect-[3/2]">
                            <Image
                              fill
                              src={winner.prize?.image}
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
              </>
            ) : (
              <Box className="flex text-[2rem] h-[32rem] justify-center items-center">
                No winners yet.
              </Box>
            )}
          </Box>
        </ModalWindow>
      </Box>
    </Menus>
  );
}
