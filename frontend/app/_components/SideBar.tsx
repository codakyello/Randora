import Logo from "./Logo";
import MobileSideNav from "./MobileSideNav";
import Nav from "./Nav";
import LogoutButton from "./LogoutButton";

export default function SideBar() {
  return (
    <>
      {/*Mobile Nav*/}
      <MobileSideNav />
      {/*Desktop Nav*/}
      <aside className="hidden bg-[var(--color-grey-0)] md:fixed w-[23rem] border-r border-r-[var(--color-grey-100)] top-0 left-0 h-full md:flex py-[1.2rem] md:py-[3.2rem] md:px-[2.4rem]  flex-col gap-16 row-span-2">
        <Logo />
        <Nav />

        <LogoutButton />
      </aside>
    </>
  );
}
