"use client";

import Table, { Body, Footer, Header } from "./Table";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import Menus from "./Menu";
import { Event, Participant } from "../_utils/types";
import ParticipantRow from "./ParticipantRow";

export default function ParticipantTable({
  participants,
  count,
}: {
  participants: Participant[];
  count: number;
}) {
  return (
    <Modal>
      <Table columns={["20rem, 25rem, 20rem, 20rem, 1fr"]}>
        <Header
          headers={[
            "Name",
            "Email",
            <div className="text-center">Ticket Number</div>,
            <div className="text-center">Prize</div>,
          ]}
        />
        <Menus>
          <Body>
            {participants.map((participant) => (
              <ParticipantRow participant={participant} key={participant._id} />
            ))}
          </Body>
        </Menus>
        <Footer>
          {Number(count) > RESULTS_PER_PAGE ? <Pagination count={count} /> : ""}
        </Footer>
      </Table>
    </Modal>
  );
}
