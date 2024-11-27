import NavList from "./NavList";

export default function Nav({ closeNav }: { closeNav?: () => void }) {
  return <NavList closeNav={closeNav} />;
}
