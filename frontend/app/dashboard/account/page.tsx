import UpdateUserForm from "@/app/_components/UpdateUserForm";
import UpdatePasswordForm from "@/app/_components/UpdatePasswordForm";
import { Box } from "@chakra-ui/react";
import { getUser } from "@/app/_lib/data-service";

export const metadata = {
  title: "Account",
};

async function Page() {
  const user = await getUser();
  return (
    <Box className="flex flex-col gap-[2rem] px-[2rem] md:gap-[3.2rem]">
      <h1>Account</h1>

      <h2>Update user data</h2>
      <UpdateUserForm user={user} />

      <h2>Update password</h2>
      <UpdatePasswordForm />
    </Box>
  );
}

export default Page;
