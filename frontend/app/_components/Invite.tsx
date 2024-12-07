"use client";

import { Box } from "@mui/material";
import Button from "./Button";
import { respondToInvite } from "../_lib/data-service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import SpinnerMini from "./SpinnerMini";

export default function Invite({
  owner,
  invite,
  token,
  organisationId,
}: {
  owner: {
    userName: string;
    image: string;
    organisationName: string;
  };
  invite: {
    userName: string;
    image: string;
    expiresAt: string;
    status: string;
  };
  token: string;
  organisationId: string;
}) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const router = useRouter();
  const handleAccept = async () => {
    setIsAccepting(true);
    const res = await respondToInvite(organisationId, token, true);
    if (res.status === "error") {
      toast.error(res.message);
      console.log(res.message);
    } else {
      router.push(`/dashboard`);
    }
    setIsAccepting(false);
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    const res = await respondToInvite(organisationId, token, false);
    if (res.status === "error") {
      toast.error(res.message);
      console.log(res.message);
    } else {
      router.push(`/dashboard`);
    }

    setIsDeclining(false);
  };

  return (
    <Box className="h-screen bg-[var(--color-grey-0)]">
      <Box className="flex pt-[10rem] ml-auto mr-auto w-[40rem] flex-col gap-[2rem] items-center text-center">
        <Box className="flex gap-[1rem] items-center">
          <Box
            className="flex w-[7rem] aspect-square relative items-center rounded-full"
            style={{
              backgroundImage: `url(${owner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span className="text-[var(--color-grey-500)]">+</span>
          <Box
            className="flex w-[7rem] aspect-square relative items-center rounded-full"
            style={{
              backgroundImage: `url(${invite.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Box>

        <Box>
          <p className="text-[var(--color-grey-700)] text-[2rem]">
            <span className="text-[var(--color-primary)]">
              {owner.userName}
            </span>{" "}
            is inviting you to join their organisation {owner.organisationName}
          </p>
        </Box>

        <Box className="grid grid-cols-2 gap-[1rem]">
          <Button
            onClick={handleAccept}
            className="w-[15rem]"
            type="primary"
            loading={isAccepting}
          >
            Accept
          </Button>
          <Button onClick={handleDecline} className="w-[15rem]" type="cancel">
            {isDeclining ? (
              <SpinnerMini className="border-[var(--color-primary)]" />
            ) : (
              "Decline"
            )}
          </Button>
        </Box>

        <Box className="mt-[1rem] items-start text-start  flex flex-col gap-[2rem]">
          <Box className="text-[var(--color-grey-500)]">
            <p className=" mb-2">If you accepts you&apos;ll be able to;</p>
            <ul className="leading-[3rem] list-disc list-inside">
              <li>View and edit organisation events </li>
              <li>Create new organisation events</li>
              <li>View organisation analytics</li>
            </ul>
          </Box>

          <Box className="text-start text-[var(--color-grey-500)]">
            <p className=" mb-2">Owner of Octa will be able to see:</p>
            <ul className="leading-[3rem] list-disc list-inside">
              <li>Your public profile information</li>
              <li>Your email address </li>
              <li>Your username</li>
            </ul>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
