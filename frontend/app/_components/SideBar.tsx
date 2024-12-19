import Logo from "./Logo";
import MobileSideNav from "./MobileSideNav";
import Nav from "./Nav";
import LogoutButton from "./LogoutButton";
import UpgradePlan from "./UpgradePlan";
import { differenceInDays } from "date-fns";
import { Box } from "@chakra-ui/react";
import { getOrganisation, getUser } from "../_lib/data-service";

export default async function SideBar() {
  // for organisation account expiry date is on the organisation object
  // for individual account expiry date is on the user object
  const user = await getUser();

  // if its organisation account, check if the user owns the organisation, if so get the subscription expiry date from the organisation object
  // if its individual account, get the subscription expiry date from the user object
  let subscriptionExpiryDate = "";

  // individual account
  if (
    user &&
    user.accountType === "individual" &&
    user.subscriptionExpiryDate
  ) {
    subscriptionExpiryDate = user.subscriptionExpiryDate.trim();
  }

  // organisation account
  if (user && user.accountType === "organisation") {
    const organisation = await getOrganisation(user.organisationId);
    subscriptionExpiryDate = organisation.subscriptionExpiryDate.trim();
  }

  const daysUntilExpiry = differenceInDays(
    new Date(subscriptionExpiryDate),
    new Date()
  );

  return (
    <>
      {/*Mobile Nav*/}
      <MobileSideNav user={user} daysUntilExpiry={daysUntilExpiry} />
      {/*Desktop Nav*/}
      <aside className="hidden bg-[var(--color-grey-0)] border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full md:flex py-[1.2rem] md:pt-[3rem] md:pb-[1.5rem] md:px-[2.4rem]  flex-col gap-16 row-span-2">
        <Logo />
        <Nav user={user} />

        {/*  render this when the subscription expiry date is less than 7 days but greater than 0 */}

        <Box className="flex flex-col gap-16 mt-auto">
          {daysUntilExpiry < 7 && daysUntilExpiry > 0 && (
            <UpgradePlan daysUntilExpiry={daysUntilExpiry} />
          )}

          <LogoutButton />
        </Box>
      </aside>
    </>
  );
}
