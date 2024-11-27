import { Box } from "@chakra-ui/react";
import { CSSProperties, ReactElement } from "react";

export default function Stat({
  name,
  stat,
  icon,
  color,
}: {
  name: string;
  stat: string | number;
  color: string;
  icon: ReactElement;
}) {
  return (
    <Box
      style={
        {
          "--icon-box-color": `var(--color-${color}-100)`,
          "--icon-color": `var(--color-${color}-700)`,
        } as CSSProperties & { [key: string]: string }
      }
      className="bg-[var(--color-grey-0)] grid grid-cols-[6.4rem_1fr] grid-rows-2 p-[1.6rem] gap-y-[.4rem] gap-x-[1.6rem] rounded-[var(--border-radius-md)] items-center"
    >
      <Box className="icon-box text-[var(--icon-color)] row-span-full flex items-center justify-center rounded-[50%] bg-[var(--icon-box-color)] aspect-square">
        {icon}
      </Box>
      <h5 className="text-[var(--color-grey-500)] uppercase text-[1.2rem] tracking-[.4px] font-medium self-end">
        {name}
      </h5>
      <p className="text-[2.4rem] font-medium leading-none">{stat}</p>
    </Box>
  );
}
