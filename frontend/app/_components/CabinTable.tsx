"use client";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import { Cabin } from "../_utils/types";
import CabinRow from "./CabinRow";
import Menus from "./Menu";
import Pagination from "./Pagination";
import Table, { Body, Footer, Header } from "./Table";

export default function CabinTable({
  cabins,
  count,
}: {
  cabins: Cabin[] | null;
  count: number | null;
}) {
  return (
    <Table columns={["10rem", "25rem", "30rem", "13.5rem", "13.5rem", "3rem"]}>
      <Header headers={["", "cabin", "capacity", "price", "discount"]} />
      <Menus>
        <Body
          data={cabins}
          render={(cabin) => <CabinRow key={cabin._id} cabin={cabin} />}
        />
      </Menus>

      <Footer>
        {Number(count) > RESULTS_PER_PAGE ? <Pagination count={count} /> : ""}
      </Footer>
    </Table>
  );
}
