import { Box } from "@chakra-ui/react";
import { Prize } from "../_utils/types";
import RaffelPrizeRow from "./RaffelPrizeRow";

export default function RaffelPrizesList({
  prizes,
  setSelectedPrize,
}: {
  prizes: Prize[];
  setSelectedPrize: (prize: Prize) => void;
}) {
  console.log(prizes);
  const sortedPrizes = prizes.sort((a, b) => b?.quantity - a?.quantity);
  return (
    <Box className="flex flex-col gap-5">
      {sortedPrizes.map((prize) => (
        <RaffelPrizeRow
          key={prize._id}
          prize={prize}
          setSelectedPrize={setSelectedPrize}
        />
      ))}
    </Box>
  );
}
