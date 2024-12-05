"use client";

import Table, { Body, Footer, Header } from "./Table";
import { Collaborator } from "../_utils/types";
import { CollaboratorRow } from "./CollaboratorRow";
import Pagination from "./Pagination";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import Modal from "./Modal";
import Menus from "./Menu";

export default function CollaboratorTable({
  collaborators,
  count,
}: {
  collaborators: Collaborator[];
  count: number;
}) {
  return (
    <Modal>
      <Table columns={["5rem, 1fr, 1fr, 3rem"]}>
        <Header
          headers={["", "Collaborator", <div className="ml-2">Status</div>, ""]}
        />
        <Menus>
          <Body>
            {collaborators.map((collaborator) => (
              <CollaboratorRow
                collaborator={collaborator}
                key={collaborator._id}
              />
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
