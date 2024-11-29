"use client";

import Table, { Body, Footer, Header } from "./Table";
import EventRow from "./EventRow";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import Menus from "./Menu";
import { Event } from "../_utils/types";

export default function EventTable({
  events,
  count,
}: {
  events: Event[];
  count: number;
}) {
  return (
    <Modal>
      <Table columns={["8rem, 13.5rem, 33rem, 14rem, 13.5rem, 10rem"]}>
        <Header
          headers={[
            "Name",
            "Type",
            "Start Date",
            "End Date",
            "Status",
            "Participants",
          ]}
        />
        <Menus>
          <Body>
            {events.map((event) => (
              <EventRow event={event} key={event._id} />
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
