"use client";
import { Box } from "@chakra-ui/react";
import { LuArrowDownUp } from "react-icons/lu";
import { AccountUser, OrgAccount } from "../_utils/types";
import { useEffect, useState } from "react";
import useOutsideClick from "../_hooks/useOutsideClick";
import { getUser, updateUser } from "../_lib/data-service";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function AccountBox() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [activeAccount, setActiveAccount] = useState<AccountUser>();
  const ref = useOutsideClick<HTMLDivElement>(() => {
    setOpen(false);
  });

  useEffect(() => {
    if (user && user.organisationId) {
      const account = user?.accounts?.find(
        (account: OrgAccount) =>
          user.organisationId === account?.organisation._id
      );

      setActiveAccount({
        _id: account?._id || "",
        image: account?.organisationImage.image || "",
        userName: account?.organisation?.name || "",
      });
    } else {
      setActiveAccount(user);
    }
  }, [user]);

  // Listen for route changes and refetch user data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [pathname, queryClient]);

  async function handleAccountSwitch(id: string, organisationId?: string) {
    if (activeAccount?._id === id) {
      return;
    }

    setSwitching(true);
    let res;
    if (organisationId) {
      res = await updateUser({ organisationId });
    } else {
      res = await updateUser({ organisationId: "undefined" });
    }

    if (res?.status === "error") {
      if (res.message) toast.error(res.message);
      else toast.error("Error switching account");
    } else {
      window.location.href = "/dashboard"; // Navigate to the dashboard
    }

    setSwitching(false);
  }

  if (isLoading || error) return null;
  if (user.accounts.length)
    return (
      <Box
        onClick={() => {
          setOpen(true);
        }}
        className="relative cursor-pointer bg-[var(--color-grey-100)] py-[1rem] px-[.5rem] rounded-2xl"
      >
        <Box className="flex items-center gap-[1rem]">
          <Box className="rounded-[10px] overflow-hidden">
            <img
              className="w-[4.2rem]  h-[4.2rem]"
              src={activeAccount?.image}
            />
          </Box>
          <p className="font-medium">
            {capitalizeFirstLetter(activeAccount?.userName || "")}
          </p>
        </Box>

        <Box className="absolute top-[1rem] right-[1.5rem]  flex flex-col items-center ">
          <LuArrowDownUp />
        </Box>

        {open && (
          <Box
            ref={ref}
            className="absolute p-5 translate-x-[100%] z-[999] rounded-2xl shadow-2xl max-h-[25rem] top-0 right-[-1rem] w-[30rem] bg-[var(--color-grey-0)] space-y-6"
          >
            <Box
              onClick={async () => {
                if (!switching) {
                  await handleAccountSwitch(user._id);
                  setOpen(false);
                }
              }}
              className={`flex p-2 rounded-2xl gap-6 cursor-pointer ${
                switching
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[var(--color-grey-100)]"
              } ${
                activeAccount?._id === user._id
                  ? "bg-[var(--color-grey-100)]"
                  : ""
              }`}
            >
              <Box className=" rounded-[10px] overflow-hidden">
                <img className="w-[4.2rem]  h-[4.2rem]" src={user?.image} />
              </Box>
              <Box>
                <p className="font-medium">
                  {capitalizeFirstLetter(user?.userName)}
                </p>
                <p className="text-[1.4rem] text-[var(--color-grey-500)]">
                  Individual
                </p>
              </Box>
              {activeAccount?._id === user._id && (
                <FaCheck className="ml-auto text-[1.8rem] text-[var(--color-grey-500)]" />
              )}
            </Box>

            {user?.accounts.map((account: OrgAccount) => (
              <Box
                onClick={async () => {
                  if (!switching) {
                    await handleAccountSwitch(
                      account._id,
                      account?.organisation._id
                    );
                    setOpen(false);
                  }
                }}
                className={`flex p-2 rounded-2xl gap-6 cursor-pointer ${
                  switching
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--color-grey-100)]"
                } ${
                  activeAccount?._id === account._id
                    ? "bg-[var(--color-grey-100)]"
                    : ""
                }`}
                key={account?._id}
              >
                <Box className=" rounded-[10px] overflow-hidden">
                  <img
                    className="w-[4.2rem] h-[4.2rem]"
                    src={account?.organisationImage.image}
                  />
                </Box>
                <Box>
                  <p className="font-medium">
                    {capitalizeFirstLetter(account?.organisation?.name)}
                  </p>
                  <p className="text-[1.4rem] text-[var(--color-grey-500)]">
                    Organisation
                  </p>
                </Box>
                {activeAccount?._id === account._id && (
                  <FaCheck className="ml-auto text-[1.8rem] text-[var(--color-grey-500)]" />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );

  else {
    return <Logo/>
  }
}
