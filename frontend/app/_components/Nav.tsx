import { User } from "../_utils/types";
import NavList from "./NavList";

export default function Nav({
  closeNav,
  user,
}: {
  closeNav?: () => void;
  user: User;
}) {
  return <NavList user={user} closeNav={closeNav} />;
}
