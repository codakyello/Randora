import { Prize } from "../_utils/types";
import { useModal } from "./Modal";

export default function RaffelPrizeRow({
  prize,
  setSelectedPrize,
}: {
  prize: Prize;
  setSelectedPrize: (prize: Prize) => void;
}) {
  const { close } = useModal();
  return (
    <button
      disabled={prize.quantity < 1}
      className={`border-b cursor-pointer border-[var(--color-grey-100)] flex items-center p-[1.2rem] gap-[2.4rem] ${
        prize.quantity < 1 && "opacity-50"
      } ${prize.quantity > 0 && "hover:bg-[var(--color-grey-100)]"}`}
      onClick={() => {
        setSelectedPrize(prize);
        close();
      }}
    >
      <img
        className={`rounded-2xl w-[8rem] ${prize.quantity < 1 && "opacity-50"}`}
        src={prize.image}
        alt={prize.name}
      />
      <p className="font-medium">{prize.name}</p>
    </button>
  );
}
