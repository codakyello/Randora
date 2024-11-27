import { ReactNode } from "react";

function FormRow({
  label,
  children,
  htmlFor,
  orientation = "vertical",
}: {
  label: string;
  htmlFor: string;
  orientation?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mb-5 grid gap-3 grid-cols-1  ${
        orientation === "vertical"
          ? "md:gap-[.8rem]"
          : "md:grid-cols-[18.7rem_1fr] lg:grid-cols-[24rem_.5fr] md:gap-[2.4rem] items-center"
      }  md:py-[1.2rem] border-b border-[var(--color-grey-100)]`}
    >
      <label className={`font-medium`} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default FormRow;
