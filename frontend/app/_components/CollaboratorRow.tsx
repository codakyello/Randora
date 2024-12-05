"use client";
import { Collaborator } from "../_utils/types";
import { getTagName } from "../_utils/helpers";
import Tag from "./Tag";
import Row from "./Row";
import { Box } from "@chakra-ui/react";
import Button from "./Button";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
// import useCustomMutation from "../_hooks/useCustomMutation";

export function CollaboratorRow({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const { _id, username, email, status, image } = collaborator;

  //   const { mutate: deleteCollaborator, isPending: isDeleting } =
  //     useCustomMutation();

  function handleDelete() {
    console.log(_id);
  }
  return (
    <Row>
      {/* <Box className="font-semibold">{cabinName}</Box> */}
      <Image className="w-10 h-10 rounded-full" src={image} alt={username} />
      <Box className="flex flex-col gap-[.2rem]">
        <span className="font-medium">{username}</span>
        <span className="text-[1.2rem] text-[var(--color-grey-500)]">
          {email}
        </span>
      </Box>

      <Tag type={getTagName(status)}>{status.replace("-", " ")}</Tag>

      <Button
        className="!p-3 h-full aspect-square"
        type="cancel"
        action="button"
        onClick={() => handleDelete()}
      >
        <FaTrash color="red" size={15} />{" "}
      </Button>
    </Row>
  );
}
