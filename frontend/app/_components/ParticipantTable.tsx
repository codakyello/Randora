"use client";

import Table, { Body, Footer, Header } from "./Table";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import { Participant } from "../_utils/types";
import ParticipantRow from "./ParticipantRow";
import { Box } from "@chakra-ui/react";

export default function ParticipantTable({
  participants,
  count,
  actions = true,
}: {
  participants: Participant[];
  count: number;
  actions?: boolean;
}) {
  return (
    <Modal>
      <Box
        className={`${actions ? "h-auto" : "max-h-[35rem]"} overflow-y-scroll`}
      >
        <Table columns={["20rem, 25rem, 20rem, 20rem, 10rem, 1fr"]}>
          <Header
            headers={[
              "Name",
              "Email",
              <div key={"Ticket Number"} className="text-center">
                Ticket
              </div>,
              <div key={"Prize"} className="text-center">
                Prize
              </div>,
              "Prize Image",
            ]}
          />

          <Body>
            {participants.map((participant) => (
              <ParticipantRow
                actions={actions}
                participant={participant}
                key={participant._id}
              />
            ))}
          </Body>

          <Footer>
            {Number(count) > RESULTS_PER_PAGE ? (
              <Pagination count={count} />
            ) : (
              ""
            )}
          </Footer>
        </Table>
      </Box>
    </Modal>
  );
}
