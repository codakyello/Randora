import Logo from "./Logo";
import MobileSideNav from "./MobileSideNav";
import Nav from "./Nav";
import LogoutButton from "./LogoutButton";
import UpgradePlan from "./UpgradePlan";
import { differenceInDays } from "date-fns";
import { getUser } from "../_lib/data-service";

export default async function SideBar() {
  const user = await getUser();
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
        <Logo className="ml-[2rem]" />
        <Nav user={user} />

        {/*  render this when the subscription expiry date is less than 7 days */}

        {subscriptionExpiryDate &&
          differenceInDays(new Date(subscriptionExpiryDate), new Date()) <
            7 && (
            <UpgradePlan subscriptionExpiryDate={subscriptionExpiryDate} />
          )}

        <LogoutButton />
      </aside>
    </>
  );
}
