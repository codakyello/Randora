"use client";
import { Box } from "@chakra-ui/react";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import Button from "./Button";
import SpinnerFull from "./SpinnerFull";
import CreateEditPrizeForm from "./CreateEditPrizeForm";
import PrizeTable from "./PrizeTable";
import useEventPrizes from "../_hooks/useEventPrizes";

export default function Prizes({ eventId }: { eventId: string }) {
  const { data, isLoading } = useEventPrizes(eventId);

  const prizes = data?.prizes;

  const count = data?.totalCount;

  if (isLoading) return <SpinnerFull />;

  return (
    <Modal>
      <Box className="gap-10 min-h-[65vh] md:min-h-[63.5vh] xl:min-h-[72vh] flex flex-col justify-between">
        {prizes.length ? (
          <PrizeTable prizes={prizes} count={count} />
        ) : (
          <h2 className="mt-5">No Prizes Found</h2>
        )}

        <Box className="flex justify-between">
          <ModalOpen name="add-prize">
            <Box>
              <Button type="primary">Add Prize</Button>
            </Box>
          </ModalOpen>

          <ModalWindow name="add-prize">
            <CreateEditPrizeForm />
          </ModalWindow>
        </Box>
      </Box>
    </Modal>
  );
}
