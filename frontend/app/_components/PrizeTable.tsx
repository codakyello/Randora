"use client";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import { Prize } from "../_utils/types";
import Pagination from "./Pagination";
import PrizeRow from "./PrizeRow";
import Table, { Body, Footer, Header } from "./Table";

export default function PrizeTable({
  prizes,
  count,
}: {
  prizes: Prize[] | null;
  count: number | null;
}) {
  return (
    <Table columns={["1fr", "1fr", "1fr", "3rem"]}>
      <Header headers={["", "prize", "quantity"]} />

      <Body
        data={prizes}
        render={(prize) => <PrizeRow key={prize._id} prize={prize} />}
      />

      <Footer>
        {Number(count) > RESULTS_PER_PAGE ? <Pagination count={count} /> : ""}
      </Footer>
    </Table>
  );
}
