import React from "react";
import {
  HStack,
  PinInput as ChakraPinInput,
  PinInputField,
} from "@chakra-ui/react";

interface OTPInputProps {
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  fontSize?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  name,
  id,
  value,
  onChange,
  fontSize = "1.6rem",
}) => {
  return (
    <HStack>
      <ChakraPinInput value={value} onChange={onChange} placeholder="" id={id}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <PinInputField
              key={index}
              name={`${name}[${index}]`} // Assign name to each field
              fontSize={fontSize}
              fontWeight={"medium"}
              bg={"white"}
              height="50px"
              width="50px"
              border="1px solid rgba(0, 0, 0, 0.15)"
              borderRadius={"10px"}
            />
          ))}
      </ChakraPinInput>
    </HStack>
  );
};

export default OTPInput;
