import { Box } from "@chakra-ui/react";
import DashboardLayout from "@/app/_components/DashboardLayout";

export const metadata = {
  title: "Dashboard",
};

async function Page() {
  // const data = await getAllCabins();
  // const cabinCount = data.totalCount;

  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col md:flex-row justify-between">
        <h1 className="mb-8 md:mb-0">Overview</h1>
      </Box>

      <DashboardLayout />
    </Box>
  );
}

export default Page;
