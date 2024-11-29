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
      <Table
        columns={["15rem, 10rem, 25rem, 15rem, 10rem, 12rem, 10rem, 3rem"]}
      >
        <Header
          headers={[
            "Name",
            "Type",
            "DATES",
            "Status",
            "Participants",
            "Prize Remaining",
            "Total Prizes",
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
