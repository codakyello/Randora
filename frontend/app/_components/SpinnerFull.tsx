import React from "react";
import { Box } from "@chakra-ui/react";
function SpinnerFull() {
  return (
    <Box
      display={"flex"}
      height="100vh"
      width="100vw"
      className="absolute top-0 left-0"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <div className="spinner"></div>
    </Box>
  );
}

export default SpinnerFull;
