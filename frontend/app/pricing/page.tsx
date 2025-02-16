import { Box } from "@chakra-ui/react";
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
        <Box className="px-[2rem] min-h-screen bg-[var(--color-grey-50)]">
          <Pricing />
        </Box>
      </Menus>
    </Modal>
  );
}
