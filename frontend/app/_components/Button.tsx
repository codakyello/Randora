import { ReactNode } from "react";
import SpinnerMini from "./SpinnerMini";

export default function Button({
  loading,
  disabled,
  children,
  type,
  onClick,
  action = "button",
  className,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  type: "cancel" | "primary" | "secondary" | "danger" | "pagination";
  action?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      disabled={loading || disabled}
      type={action}
      onClick={onClick}
      className={`${className} flex justify-center whitespace-nowrap  btn btn--${type}`}
    >
      {loading ? <SpinnerMini /> : children}
    </button>
  );
}
