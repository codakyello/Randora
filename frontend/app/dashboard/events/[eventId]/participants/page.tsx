import Participants from "@/app/_components/Participants";
import Sort from "@/app/_components/Sort";
import Filter from "@/app/_components/Filter";
import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Participants",
};

export default function Page({ params }: { params: { eventId: string } }) {
  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All Participants</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
          <Filter
            defaultValue="all"
            paramName="status"
            filters={[
              { name: "All", value: "all" },
              { name: "Winners", value: "winners" },
            ]}
          />

          <Sort
            className=" max-w-[39rem]"
            defaultValue="startDate-desc"
            options={[
              {
                name: "Sort by created date (recent first)",
                value: "createdDate-desc",
              },
              {
                name: "Sort by created date (earlier first)",
                value: "createdDate-asc",
              },
              {
                name: "Sort by ticket number (high first)",
                value: "ticketNumber-desc",
              },
              {
                name: "Sort by ticket number (low first)",
                value: "ticketNumber-asc",
              },
            ]}
          />
        </Box>
      </Box>

      <Participants eventId={params.eventId} />
    </Box>
  );
}
