import Modal from "@/app/_components/Modal";
import Login from "../../_components/Login";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  );
}
