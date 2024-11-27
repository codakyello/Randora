"use client";
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { generateGridTemplateColumns } from "../_utils/helpers";
import { useTable } from "./Table";

export default function Row({ children }: { children: ReactNode }) {
  const { columns } = useTable();
  return (
    <Box
      style={{
        gridTemplateColumns: generateGridTemplateColumns(columns),
      }}
      className=" border-b border-[var(--color-grey-100)] grid items-center grid-cols-[0.6fr_2fr_2.4fr_1.4fr_1fr_3.2rem] py-[1.2rem] px-[2.4rem] gap-[2.4rem]"
    >
      {children}
    </Box>
  );
}
