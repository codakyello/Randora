import { Box } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { formatNumber } from "../_utils/helpers";
import { BsInfoCircleFill } from "react-icons/bs";

export default function Stat({
  name,
  stat,
  statColor,
  backgroundColor,
  titleColor,
  description,
}: {
  name: string;
  stat: number;
  statColor: string;
  backgroundColor: string;
  titleColor: string;
  description: string;
}) {
  return (
    <Box
      style={
        {
          "--stat-color": `var(--color-${statColor})`,
          "--stat-bg-color": `var(--color-${backgroundColor}-0)`,
          "--title-color": `var(--color-${titleColor}-700)`,
        } as CSSProperties & { [key: string]: string }
      }
      className="flex flex-col gap-5 bg-[var(--stat-bg-color)] p-[2.5rem] rounded-2xl"
    >
      <Box className="flex items-center justify-between">
        <h5 className="uppercase text-[var(--title-color)] text-[1.2rem] tracking-[.4px] font-medium">
          {name}
        </h5>
        <Box className="relative group">
          <BsInfoCircleFill className="cursor-pointer text-[var(--stat-color)] mr-2 text-[1.8rem]" />
          <Box className="opacity-0 font-semibold group-hover:opacity-100 pointer-events-none text-[1rem] text-center left-[-10rem] w-[12rem] absolute text-[#333] bg-white shadow-lg p-2 rounded-md transition-opacity duration-200">
            {description}
          </Box>
        </Box>
      </Box>

      <p className="text-[2.4rem] text-[var(--stat-color)] font-medium leading-none">
        {formatNumber(stat)}
      </p>
    </Box>
  );
}
