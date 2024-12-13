import { Box } from "@chakra-ui/react";
import UpdateUserPasswordForm from "@/app/_components/UpdateUserPasswordForm";

export const metadata = {
  title: "Account",
};

function Page() {
  return (
    <Box className="flex flex-col gap-[2rem] px-[2rem] md:gap-[3.2rem]">
      <h1>Account</h1>
      <UpdateUserPasswordForm />
    </Box>
  );
}

export default Page;
