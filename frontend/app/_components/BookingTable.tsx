"use client";

import Table, { Body, Footer, Header } from "./Table";
import { Booking } from "../_utils/types";
import { BookingRow } from "./BookingRow";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import Menus from "./Menu";

export default function EventTable({
  events,
  count,
}: {
  events: Events[];
  count: number;
}) {
  return (
    <Modal>
      <Table columns={["8rem, 26rem, 33rem, 14rem, 13.5rem, 3rem"]}>
        <Header headers={["Name", "Guest", "Dates", "Status", "Amount"]} />
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
