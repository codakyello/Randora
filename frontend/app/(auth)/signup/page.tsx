import Modal from "@/app/_components/Modal";
import Signup from "@/app/_components/SignUp";

export const metadata = {
  title: "Signup",
};
export default function Page() {
  return (
    <Modal>
      <Signup />
    </Modal>
  );
}
