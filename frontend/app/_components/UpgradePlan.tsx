import { Box } from "@chakra-ui/react";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function UpgradePlan() {
  return (
    <Box className="mt-auto p-8 bg-[var(--color-brand-200)] text-[#374151] rounded-3xl">
      <div className="w-[10rem] leading-[2.5rem] font-semibold text-[2rem]">
        Upgrade your plan
      </div>
      <p className="my-[1rem] mb-[2rem] text-[1.2rem] leading-9">
        Your trial plan ends in 7 days. Upgrade your plan and unlock full
        potential!
      </p>

      <button className="p-5 flex gap-2 items-center justify-center rounded-3xl text-[1.4rem] w-full bg-black text-white">
        <HiOutlineSparkles className="text-white text-[2rem]" /> See prices
      </button>
    </Box>
  );
}
