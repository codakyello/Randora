import { Box } from "@chakra-ui/react";
import SignUpForm from "@/app/_components/SignUpForm";

export const metadata = {
  title: "Users",
};

export default function Page() {
  return (
    <Box className="flex flex-col gap-[2rem] md:gap-[3.2rem]">
      <h1>Create a new user</h1>
      <SignUpForm />
    </Box>
  );
}
