import Pricing from "../_components/Pricing";
import Modal from "../_components/Modal";
import Menus from "../_components/Menu";

export const metadata = {
  title: "Pricing",
};

export default function Page() {
  return (
    <Modal>
      <Menus>
        <Pricing />
      </Menus>
    </Modal>
  );
}
