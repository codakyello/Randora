"use client";
import Logo from "./Logo";
import MobileSideNav from "./MobileSideNav";
import Nav from "./Nav";
import LogoutButton from "./LogoutButton";
import UpgradePlan from "./UpgradePlan";
import { differenceInDays } from "date-fns";
import { Box } from "@chakra-ui/react";
import useUser from "../_hooks/useUser";

export default function SideBar() {
  const { data: user, isLoading, error } = useUser();
  if (error) return null;
  if (isLoading) return null;

  let subscriptionExpiryDate = "";
  if (user && user.subscriptionExpiryDate) {
    subscriptionExpiryDate = user.subscriptionExpiryDate.trim();
  }

  return (
    <>
      {/*Mobile Nav*/}
      <MobileSideNav
        user={user}
        subscriptionExpiryDate={subscriptionExpiryDate}
      />
      {/*Desktop Nav*/}
      <aside className="hidden bg-[var(--color-grey-0)] border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full md:flex py-[1.2rem] md:pt-[3rem] md:pb-[1.5rem] md:px-[2.4rem]  flex-col gap-16 row-span-2">
        <Logo />
        <Nav user={user} />

        {/*  render this when the subscription expiry date is less than 7 days */}

        <Box className="flex flex-col gap-16 mt-auto">
          {subscriptionExpiryDate &&
            differenceInDays(new Date(subscriptionExpiryDate), new Date()) <
              7 && (
              <UpgradePlan subscriptionExpiryDate={subscriptionExpiryDate} />
            )}

          <LogoutButton />
        </Box>
      </aside>
    </>
  );
}
