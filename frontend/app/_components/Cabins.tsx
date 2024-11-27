import { Box } from "@chakra-ui/react";
import { getAllCabins } from "../_lib/data-service";
import Button from "./Button";
import CabinTable from "./CabinTable";
import CreateEditCabinForm from "./CreateEditCabinForm";
import Modal, { ModalOpen, ModalWindow } from "./Modal";

export default async function Cabins({
  searchParams,
}: {
  searchParams: { page: string; discount: string; sortBy: string };
}) {
  const data = await getAllCabins(searchParams);
  const count = data.totalCount;
  const cabins = data.cabins;

  return (
    <Modal>
      {cabins.length ? (
        <CabinTable count={count} cabins={cabins} />
      ) : (
        <h2 className="mt-5">No Cabins Found</h2>
      )}
      <ModalOpen name="add-cabin">
        <Box>
          <Button type="primary">Add new cabin</Button>
        </Box>
      </ModalOpen>

      <ModalWindow name="add-cabin">
        <CreateEditCabinForm />
      </ModalWindow>
    </Modal>
  );
}
