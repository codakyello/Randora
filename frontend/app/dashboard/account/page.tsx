import UpdateUserForm from "@/app/_components/UpdateUserForm";
import UpdatePasswordForm from "@/app/_components/UpdatePasswordForm";
import { Box } from "@chakra-ui/react";
import { getAdmin } from "@/app/_lib/data-service";
import { getToken } from "@/app/_utils/serverUtils";

export const metadata = {
  title: "Account",
};

async function Page() {
  const token = await getToken();
  const user = await getAdmin(token);
  return (
    <Box className="flex flex-col gap-[2rem] md:gap-[3.2rem]">
      <h1>Update your account</h1>

      <h2>Update user data</h2>
      <UpdateUserForm user={user} />

      <h2>Update password</h2>
      <UpdatePasswordForm />
    </Box>
  );
}

export default Page;
