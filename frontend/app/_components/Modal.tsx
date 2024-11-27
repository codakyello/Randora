"use client";
import { Box } from "@chakra-ui/react";
import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import useOutsideClick from "../_hooks/useOutsideClick";

const ModalContext = createContext<
  | { isOpen: string; open: (name: string) => void; close: () => void }
  | undefined
>(undefined);

export default function Modal({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState("");
  const open = setOpen;
  const close = () => setOpen("");

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

export function ModalOpen({
  children,
  name,
}: {
  children: ReactElement;
  name: string;
}) {
  const context = useContext(ModalContext);

  if (!context) return;

  const { open } = context;
  return cloneElement(children, {
    onClick: () => {
      open(name);
    },
  });
}

export function ModalWindow({
  children,
  name,
}: {
  children: ReactElement;
  name: string;
}) {
  const { close, isOpen } = useModal();

  const ref = useOutsideClick<HTMLDivElement>(close);

  return isOpen === name ? (
    <Box className="fixed p-5 top-0 left-0 z-[90] flex items-center justify-center h-full w-screen backdrop-blur-sm">
      <Box
        className="max-w-[80rem] flex w-screen items-center justify-center relative"
        ref={ref}
      >
        {cloneElement(children, { onClose: close })}
      </Box>
    </Box>
  ) : (
    ""
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("You cannot use modal context outside its provider");

  return context;
}
