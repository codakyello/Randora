"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterButton from "./FilterButton";
import type { Filter } from "../_utils/types";
import { Box } from "@chakra-ui/react";

export default function Filter({
  defaultValue,
  filters,
  paramName,
  className,
}: {
  defaultValue: string;
  filters: Filter[];
  paramName: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get(paramName) || defaultValue;

  const handleFilter = function (filter: string) {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Box
      className={`flex w-fit border rounded-[var(--border-radius-sm)] border-[var(--color-grey-100)] gap-2 bg-[var(--color-grey-0)] shadow-sm py-[0.44rem] px-[.8rem] ${className}`}
    >
      {filters.map((filter) => (
        <FilterButton
          key={filter.value}
          activeFilter={activeFilter}
          filter={filter}
          handleFilter={handleFilter}
        />
      ))}
    </Box>
  );
}
