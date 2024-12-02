"use client";

import Table, { Body, Footer, Header } from "./Table";
import EventRow from "./EventRow";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
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
      <Table columns={["15rem, 10rem, 18rem, 15rem, 10rem, 12rem, 10rem, 1fr"]}>
        <Header
          headers={[
            "Name",
            "Type",
            "Date",
            "Status",
            "Participants",
            "Prize Remaining",
            "Total Prizes",
          ]}
        />

        <Body>
          {events.map((event) => (
            <EventRow event={event} key={event._id} />
          ))}
        </Body>
        <Footer>
          {Number(count) > RESULTS_PER_PAGE ? <Pagination count={count} /> : ""}
        </Footer>
      </Table>
    </Modal>
  );
}
