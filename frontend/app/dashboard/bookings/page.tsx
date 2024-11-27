import Filter from "@/app/_components/Filter";
import Sort from "@/app/_components/Sort";
import { Box } from "@chakra-ui/react";

import Bookings from "@/app/_components/Bookings";

export const metadata = {
  title: "Bookings",
};

function Page() {
  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between  xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All Bookings</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
          <Filter
            defaultValue="all"
            paramName="status"
            filters={[
              { name: "All", value: "all" },
              { name: "Checked-in", value: "checked-in" },
              { name: "Checked-out", value: "checked-out" },
              { name: "Unconfirmed", value: "unconfirmed" },
            ]}
          />

          <Sort
            className=" max-w-[39rem]"
            defaultValue="startDate-desc"
            options={[
              { name: "Sort by date (recent first)", value: "startDate-desc" },
              { name: "Sort by date (earlier first)", value: "startDate-asc" },
              { name: "Sort by amount (high first)", value: "totalPrice-desc" },
              { name: "Sort by amount (low first)", value: "totalPrice-asc" },
            ]}
          />
        </Box>
      </Box>

      <Bookings />
    </Box>
    /* {bookings.map((booking: Booking) => (
        <li key={booking._id}>
          <Link href={`/dashboard/bookings/${booking._id}`}>
            <span>{booking.guest.fullName}</span>
          </Link>
        </li>
      ))} */
  );
}

export default Page;
