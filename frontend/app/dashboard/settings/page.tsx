import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Settings",
};
export default function Page() {
  // const settings = await getSettings();

  // if (!settings) return null;
  return (
    <Box className="flex flex-col gap-[2rem] md:gap-[3.2rem]">
      <h1>Settings</h1>
    </Box>
  );
}
