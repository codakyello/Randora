import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Tag({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) {
  return (
    <Box
      style={
        {
          "--tag-bg-color": `var(--color-${type}-100)`,
          "--tag-color": `var(--color-${type}-700)`,
        } as React.CSSProperties
      }
      className={`bg-[var(--tag-bg-color)] text-[var(--tag-color)] w-fit rounded-[100px] uppercase text-[1.1rem] font-semibold py-[.4rem] px-[1.2rem] `}
    >
      {children}
    </Box>
  );
}
