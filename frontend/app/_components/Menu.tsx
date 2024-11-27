"use client";

import {
  useContext,
  useState,
  createContext,
  ReactNode,
  ReactElement,
} from "react";
import { Box } from "@chakra-ui/react";
import useOutsideClick from "../_hooks/useOutsideClick";
import { HiEllipsisVertical } from "react-icons/hi2";

type MenuContextType =
  | {
      openId: string;
      close: () => void;
      open: (id: string) => void;
    }
  | undefined;

const MenuContext = createContext<MenuContextType>(undefined);

// Encapsulate button logic in menu using compound component
export default function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenuContext.Provider value={{ openId, open, close }}>
      {children}
    </MenuContext.Provider>
  );
}

function Menu({ children, id }: { children: ReactNode; id: string }) {
  const { openId, close } = useMenu();

  const ref = useOutsideClick<HTMLDivElement>(close);

  return openId === id ? (
    <Box
      ref={ref}
      className="absolute top-[20px] right-[20px] z-50 bg-[var(--color-grey-0)] shadow-md rounded-[var(--border-radius-md)]"
    >
      {children}
    </Box>
  ) : null;
}

function Toggle({ id }: { id: string }) {
  const context = useContext(MenuContext);

  if (!context) {
    return null;
  }

  const { openId, open, close } = context;

  // Clone the children and add an onClick handler to toggle the menu state
  return (
    <Box className="justify-self-end  cursor-pointer">
      <button
        onClick={() => {
          if (openId === id) return close();
          open(id);
        }}
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

  if (!context)
    throw new Error("Cannot use table context outside its provider");
  return context;
}
