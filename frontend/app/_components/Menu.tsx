"use client";

import {
  useContext,
  useState,
  createContext,
  ReactNode,
  ReactElement,
  useRef,
  MouseEvent,
} from "react";
import { Box } from "@chakra-ui/react";
import useOutsideClick from "../_hooks/useOutsideClick";
import { HiEllipsisVertical } from "react-icons/hi2";

import { createPortal } from "react-dom";

type MenuContextType =
  | {
      openId: string;
      close: () => void;
      open: (id: string) => void;
      position: { x: number; y: number };
      setPosition: ({ x, y }: { x: number; y: number }) => void;
    }
  | undefined;

const MenuContext = createContext<MenuContextType>(undefined);

// Encapsulate button logic in menu using compound component
export default function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const close = () => setOpenId("");
  const open = setOpenId;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <MenuContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Menu({ children, id }: { children: ReactNode; id: string }) {
  const { openId, close, position } = useMenu();

  const ref = useOutsideClick<HTMLDivElement>(close);
  if (openId !== id) return null;

  return createPortal(
    <Box
      style={{
        position: "absolute",
        top: position.y,
        right: position.x,
      }}
      ref={ref}
      className="bg-[var(--color-grey-0)] shadow-xl rounded-[var(--border-radius-md)]"
    >
      {children}
    </Box>,
    document.body
  );
}

function Toggle({ id }: { id: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const { setPosition, open, close, openId } = useMenu();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    const rect = (e.target as HTMLElement)
      .closest("button")!
      .getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    return openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <Box className="justify-self-end cursor-pointer">
      <button
        ref={ref}
        onClick={handleClick}
        className="bg-none border-none p-1 rounded-[var(--border-radius-sm)] translate-x-2 transition-all duration-200 hover:bg-[var(--color-grey-50)]"
      >
        <HiEllipsisVertical className="self-end h-10 w-10" />
      </button>
    </Box>
  );
}

function Button({
  icon,
  children,
  onClick,
  disabled,
}: {
  icon: ReactElement;
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full text-left bg-none border-none py-[1.5rem] px-[2.4rem] text-[1.4rem] transition-all duration-200 flex items-center gap-[1.6rem] hover:bg-[var(--color-grey-50)]"
    >
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
Menus.Menu = Menu;
Menus.Toogle = Toggle;
Menus.Button = Button;

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) throw new Error("Cannot use menu context outside its provider");
  return context;
}
