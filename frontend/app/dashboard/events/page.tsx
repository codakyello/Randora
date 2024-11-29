import Filter from "@/app/_components/Filter";
import Sort from "@/app/_components/Sort";
import { Box } from "@chakra-ui/react";
import Events from "@/app/_components/Events";

export const metadata = {
  title: "Bookings",
};

function Page() {
  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All Events</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
          <Filter
            defaultValue="all"
            paramName="status"
            filters={[
              { name: "All", value: "all" },
              { name: "Active", value: "active" },
              { name: "Cancelled", value: "cancelled" },
              { name: "Inactive", value: "inactive" },
            ]}
          />

          <Sort
            className=" max-w-[39rem]"
            defaultValue="startDate-desc"
            options={[
              {
                name: "Sort by start date (recent first)",
                value: "startDate-desc",
              },
              {
                name: "Sort by start date (earlier first)",
                value: "startDate-asc",
              },
              {
                name: "Sort by participants (high first)",
                value: "totalPrice-desc",
              },
              {
                name: "Sort by participants (low first)",
                value: "totalPrice-asc",
              },
            ]}
          />
        </Box>
      </Box>

      <Events />
    </Box>
  );
}

export default Page;
