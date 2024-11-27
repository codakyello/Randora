"use client";

import Table, { Body, Footer, Header } from "./Table";
import { Booking } from "../_utils/types";
import { BookingRow } from "./BookingRow";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import Menus from "./Menu";

export default function BookingTable({
  bookings,
  count,
}: {
  bookings: Booking[];
  count: number;
}) {
  return (
    <Modal>
      <Table columns={["8rem, 26rem, 33rem, 14rem, 13.5rem, 3rem"]}>
        <Header headers={["Cabin", "Guest", "Dates", "Status", "Amount"]} />
        <Menus>
          <Body
          // data={bookings}
          // render={(booking) => (
          //   <Menus>
          //     <BookingRow booking={booking} key={booking._id} />
          //   </Menus>
          // )}
          >
            {bookings.map((booking) => (
              <BookingRow booking={booking} key={booking._id} />
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
