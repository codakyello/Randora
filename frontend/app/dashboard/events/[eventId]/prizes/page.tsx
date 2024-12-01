import Prizes from "@/app/_components/Prizes";
import Sort from "@/app/_components/Sort";
import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Prizes",
};

export default function Page({ params }: { params: { eventId: string } }) {
  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All Prizes</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
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
                name: "Sort by quantity (high first)",
                value: "quantity-desc",
              },
              {
                name: "Sort by quantity number (low first)",
                value: "quantity-asc",
              },
            ]}
          />
        </Box>
      </Box>

      <Prizes eventId={params.eventId} />
    </Box>
  );
}
