import { Box } from "@chakra-ui/react";
import { Booking } from "../_utils/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SpinnerMini from "./SpinnerMini";
import Tag from "./Tag";
import { getTagName } from "../_utils/helpers";
import useCheckOut from "../_hooks/useCheckOut";

export default function Activity({ activity }: { activity: Booking }) {
  const router = useRouter();
  const {
    bookingId,
    status,
    numNights,
    guest: { fullName, countryFlag },
  } = activity;

  const { isPending: isCheckingOut, mutate: checkOut } = useCheckOut();

  return (
    <li
      key={bookingId}
      className="flex gap-5 items-center py-[0.8rem] border-t border-b border-t-[var(--color-grey-100)] border-b-[var(--color-grey-100)]"
    >
      <Box className="w-[9rem]">
        <Tag type={getTagName(status)}>
          {activity.status === "unconfirmed" ? "arriving" : "departing"}
        </Tag>
      </Box>

      <Box className="relative w-[2rem] h-[1.2rem] aspect-square">
        <Image fill alt="country Flag" src={countryFlag} />
      </Box>
      <p className="text-[1.4rem] font-medium">{fullName}</p>
      <p className="text-[1.4rem] ml-auto w-[7rem]">{numNights} nights</p>
      <button
        onClick={() => {
          if (activity.status === "unconfirmed") {
            router.push(`/dashboard/checkin/${bookingId}`);
          } else {
            checkOut(bookingId); //checkout
          }
        }}
        className="uppercase whitespace-nowrap w-[9rem] h-[2.6rem] flex items-center justify-center bg-[var(--color-brand-600)] font-semibold text-[1.2rem] border-none text-[var(--color-grey-0)] rounded-[var(--border-radius-sm)]"
      >
        {isCheckingOut ? (
          <SpinnerMini />
        ) : status === "unconfirmed" ? (
          "check in"
        ) : (
          "check out"
        )}
      </button>
    </li>
  );
}
