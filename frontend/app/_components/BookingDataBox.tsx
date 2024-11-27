import { Box } from "@chakra-ui/react";
import {
  formatCurrency,
  formatDistanceFromNow,
  getTagName,
} from "../_utils/helpers";
import Tag from "./Tag";
import { HomeModernIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Image from "next/image";
import { HiOutlineAnnotation, HiOutlineCheckCircle } from "react-icons/hi";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { Booking, Settings } from "../_utils/types";
import { useRouter } from "next/navigation";

export default function BookingDataBox({
  booking,
  settings,
}: {
  booking: Booking;
  settings: Settings;
}) {
  const router = useRouter();

  const {
    bookingId,
    created_at,
    status,
    numNights,
    startDate,
    endDate,
    observations,
    hasBreakfast,
    totalPrice,
    numGuests,
    guest: { countryFlag, fullName, email, nationalId },
    cabin: { regularPrice },
  } = booking;

  const { breakFastPrice } = settings;

  return (
    <Box className=" flex flex-col gap-[3.2rem]">
      <Box className="flex items-center gap-8 ">
        <h1>Booking #{bookingId}</h1>
        <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>
        <button
          onClick={() => router.back()}
          className="ml-auto text-[var(--color-brand-600)]"
        >
          &larr; Back
        </button>
      </Box>

      <Box className="rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] overflow-hidden bg-[var(--color-grey-0)]">
        <Box className="flex gap-[1.6rem] items-center py-[2rem] px-[4rem] bg-[var(--color-brand-500)] text-[rgb(224,231,255)] text-[1.8rem]">
          <HomeModernIcon className="font-semibold h-[3.2rem] w-[3.2rem]" />
          <p className="font-semibold">{numNights} nights in Cabin 002</p>
          <span className="ml-auto">
            {format(new Date(startDate), "EEE, MMM dd yyy")} (
            {formatDistanceFromNow(startDate)}) &mdash;
            {format(new Date(endDate), "EEE, MMM dd yyy")}
          </span>
        </Box>
        <Box className="py-[2rem] px-[4rem] flex flex-col  gap-[.8rem]">
          <Box className="flex items-center gap-5 mb-[1.6rem]">
            <Box className="text-[var(--color-grey-700)] relative w-[2rem] h-[1.2rem] ">
              <Image fill src={countryFlag} alt="country Flag" />
            </Box>
            <p className="font-medium ">
              {fullName} {numGuests > 0 ? `+ ${numGuests} guests` : ""}
            </p>
            <span>•</span>
            <p className="text-[var(--color-grey-500)]">{email}</p>

            <p className="text-[var(--color-grey-500)]">
              {nationalId && `• National ID ${nationalId}`}
            </p>
          </Box>
          {observations && (
            <Box className="flex items-center gap-5">
              <HiOutlineAnnotation className="w-[2rem] text-[var(--color-brand-600)] h-[2rem]" />

              <div className="flex items-center gap-[1.6rem]">
                <p className="font-medium ">Observations</p>
                <span>{observations ? observations : "No observation"}</span>
              </div>
            </Box>
          )}
          <Box className="flex items-center gap-5">
            <HiOutlineCheckCircle className="w-[2rem] text-[var(--color-brand-600)] h-[2rem]" />

            <div className="flex items-center gap-[1.6rem]">
              <p className="font-medium">Breakfast included? </p>
              <span>{hasBreakfast ? "Yes" : "No"}</span>
            </div>
          </Box>

          <Box
            className={`flex justify-between py-[2.2rem] px-[3.5rem] rounded-[var(--border-radius-sm)] mt-[2.4rem]  ${
              status !== "unconfirmed"
                ? "text-[var(--color-green-700)] bg-[var(--color-green-100)]"
                : "text-[var(--color-yellow-700)] bg-[var(--color-yellow-100)]"
            } `}
          >
            <Box className="flex items-center gap-5">
              <HiOutlineCurrencyDollar className="w-[2.4rem]  h-[2.4rem]" />

              <p className="font-medium">Total price</p>
              <p>
                {formatCurrency(totalPrice)}
                {hasBreakfast
                  ? `(${formatCurrency(
                      regularPrice * numNights
                    )} + ${formatCurrency(
                      breakFastPrice * numGuests * numNights
                    )} breakfast)`
                  : ""}
              </p>
            </Box>

            <p className="uppercase font-semibold">
              {status !== "unconfirmed" ? " Paid" : "Will pay at property "}
            </p>
          </Box>
          <Box className="flex py-[1.6rem] px-[4rem] justify-end text-[1.2rem]">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, hh:mm a")}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
