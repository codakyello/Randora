"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { Filter } from "../_utils/types";

export default function Sort({
  defaultValue,
  options,
  className,
}: {
  defaultValue: string;
  options: Filter[];
  className?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeSort = searchParams.get("sortBy") || defaultValue;
  console.log(activeSort);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      value={activeSort}
      onChange={handleChange}
      className={` text-[1.4rem] py-[.8rem] px-[1.2rem] border- border-[var(--color-grey-100)] rounded-[5px] bg-[var(--color-grey-0)] font-medium shadow-sm ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
