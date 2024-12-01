"use client";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import { Prize } from "../_utils/types";
import Menus from "./Menu";
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
    <Table columns={["10rem", "45rem", "45rem", "1fr"]}>
      <Header headers={["", "prize", "quantity"]} />
      <Menus>
        <Body
          data={prizes}
          render={(prize) => <PrizeRow key={prize._id} prize={prize} />}
        />
      </Menus>

      <Footer>
        {Number(count) > RESULTS_PER_PAGE ? <Pagination count={count} /> : ""}
      </Footer>
    </Table>
  );
}
