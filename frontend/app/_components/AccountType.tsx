import React from "react";
import { Box, RadioGroup, Radio, Stack } from "@chakra-ui/react";
import Button from "@/app/_components/Button";
import { UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

const AccountType = ({
  onStep,
  onAccountType,
  accountType,
}: {
  onStep: (step: number) => void;
  onAccountType: (type: string) => void;
  accountType: string;
}) => {
  const accountTypes = [
    {
      id: "individual",
      title: "Individual Account",
      description: "Personal account for individual use",
      icon: UserIcon,
    },
    {
      id: "organisation",
      title: "Organisation Account",
      description: "Joint account for teams and companies",
      icon: BuildingOfficeIcon,
    },
  ];

  const handleTypeChange = (value: string) => {
    onAccountType(value);
  };

  return (
    <Box className="mx-auto flex flex-col p-5 bg-[var(--color-grey-50)] h-screen items-center justify-center">
      <Box className="max-w-[48rem]">
        <h2 className="mb-5">Choose Account Type</h2>

        <RadioGroup value={accountType} onChange={handleTypeChange}>
          <Stack spacing={3}>
            {accountTypes.map((type) => (
              <Box
                key={type.id}
                borderWidth={accountType === type.id ? "2px" : "1px"}
                borderColor={
                  accountType === type.id ? "var(--color-primary)" : "gray.300"
                }
                p={4}
                cursor="pointer"
                borderRadius="md"
                className="bg-[var(--color-grey-0)] mb-3 !rounded-2xl"
              >
                <Radio value={type.id} size="lg">
                  <Box display="flex" alignItems="center" gap={4}>
                    <type.icon className="w-8 h-8 text-gray-600" />
                    <Box>
                      <p>{type.title}</p>
                      <p>{type.description}</p>
                    </Box>
                  </Box>
                </Radio>
              </Box>
            ))}
          </Stack>
        </RadioGroup>

        <Box className="flex w-full bg-[var(--color-grey-50)]">
          <Button type="primary" onClick={() => onStep(2)} className="mt-6">
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountType;
