import { Filter } from "../_utils/types";

export default function FilterButton({
  handleFilter,
  filter,
  activeFilter,
}: {
  handleFilter: (filter: string) => void;
  filter: Filter;
  activeFilter: string;
}) {
  return (
    <li
      onClick={() => {
        handleFilter(filter.value);
      }}
      className={`${
        activeFilter === filter.value
          ? "bg-[var(--color-primary)] text-[var(--color-grey-50)]"
          : ""
      } hover:bg-[var(--color-primary)] py-[0.4rem] px-[0.8rem] hover:text-[var(--color-grey-50)] cursor-pointer text-[1.4rem] font-medium  rounded-[5px] flex items-center justify-center transition-all duration-[.1s]`}
      key={filter.value}
    >
      {filter.name}
    </li>
  );
}

// So black will be black in light mode and color brand-200 in dark mode
