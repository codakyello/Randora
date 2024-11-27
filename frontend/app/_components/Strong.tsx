import { ReactNode } from "react";

export default function Strong({ children }: { children: ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}
