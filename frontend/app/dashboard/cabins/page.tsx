import Sort from "@/app/_components/Sort";
import Filter from "@/app/_components/Filter";
import { Box } from "@chakra-ui/react";
import { Suspense } from "react";
import Cabins from "@/app/_components/Cabins";
import Loading from "../loading";

export const metadata = {
  title: "Cabins",
};

async function Page({
  searchParams,
}: {
  searchParams: { page: string; discount: string; sortBy: string };
}) {
  return (
    <Box className="flex flex-col gap-[3.2rem]">
      <Box className="flex flex-col lg:flex-row gap-8 pt-1 pr-1">
        <h1 className="">All Cabins</h1>
        <Box className="flex flex-col md:flex-row gap-6 lg:ml-auto">
          <Filter
            defaultValue="all"
            paramName="discount"
            className="w-[28rem]"
            filters={[
              { name: "All", value: "all" },
              { name: "No discount", value: "no-discount" },
              { name: "With discount", value: "with-discount" },
            ]}
          />

          <Sort
            className="max-w-[28rem]"
            defaultValue="startDate-desc"
            options={[
              { name: "Sort by name (A-Z)", value: "name-asc" },
              { name: "Sort by name (Z-A)", value: "name-desc" },
              {
                name: "Sort by price (low first)",
                value: "regularPrice-asc",
              },
              {
                name: "Sort by price (high first)",
                value: "regularPrice-desc",
              },
              {
                name: "Sort by capacity (low first)",
                value: "maxCapacity-asc",
              },
              {
                name: "Sort by capacity (high first)",
                value: "maxCapacity-desc",
              },
            ]}
          />
        </Box>
      </Box>

      <Suspense
        fallback={<Loading />}
        key={`${searchParams.discount}-${searchParams.page}-${searchParams.sortBy}`}
      >
        <Cabins searchParams={searchParams} />
      </Suspense>
    </Box>
  );
}

export default Page;
