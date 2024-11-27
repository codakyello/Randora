"use client";
import { Box } from "@chakra-ui/react";
import Button from "./Button";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Strong from "./Strong";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Pagination({ count }: { count: number | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const pageCount = Math.ceil(Number(count) / 10);

  let page = Number(searchParams.get("page")) || 1;
  const from = (page - 1) * RESULTS_PER_PAGE + 1;
  const to = page === pageCount ? count : page * RESULTS_PER_PAGE;

  const handlePrevious = function () {
    if (page > 1) {
      page = page - 1;
      params.set("page", `${page}`);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };
  const handleNext = function () {
    page = page + 1;
    params.set("page", `${page}`);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <Box className="bg-[var(--color-grey-50)] p-[1.2rem] flex items-center">
      <span className="text">
        Showing <Strong>{from}</Strong> to <Strong>{to} </Strong>of{" "}
        <Strong>{count}</Strong> results
      </span>
      <Box className="ml-auto flex gap-[.6rem]">
        <Button
          onClick={handlePrevious}
          className="pr-[1rem]"
          disabled={page < 2}
          type="pagination"
        >
          <HiChevronLeft className="h-7 w-7" />
          <span>Previous</span>
        </Button>
        <Button
          disabled={page === pageCount}
          onClick={handleNext}
          className="pl-[1rem]"
          type="pagination"
        >
          <span>Next</span>
          <HiChevronRight className="h-7 w-7" />
        </Button>
      </Box>
    </Box>
  );
}
