import Filter from "@/app/_components/Filter";
import Sort from "@/app/_components/Sort";
import { Box } from "@chakra-ui/react";
import Events from "@/app/_components/Events";

export const metadata = {
  title: "Events",
};

function Page() {
  return (
    <Box className="flex pl-[2rem] flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All events</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
          <Filter
            defaultValue="all"
            paramName="status"
            filters={[
              { name: "All", value: "all" },
              { name: "Active", value: "active" },
              { name: "Inactive", value: "inactive" },
              { name: "Complete", value: "completed" },
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
                value: "participants-desc",
              },
              {
                name: "Sort by participants (low first)",
                value: "participants-asc",
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
