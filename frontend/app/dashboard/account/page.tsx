import { Box } from "@chakra-ui/react";
import UpdatePasswordForm from "@/app/_components/UpdatePasswordForm";
import { getOrganisation, getUser } from "@/app/_lib/data-service";
import UpdateAccountForm from "@/app/_components/UpdateAccountForm";

export const metadata = {
  title: "Account",
};

export default async function Page() {
  const user = await getUser();

  const organisation =
    user.accountType === "organisation" &&
    (await getOrganisation(user?.organisationId));

  return (
    <Box className="flex flex-col gap-[2rem] px-[2rem] md:gap-[3.2rem]">
      <h1>Account</h1>

      <h2>{organisation ? "Update Organisation data" : "Update User data"}</h2>
      <UpdateAccountForm user={user} organisation={organisation} />

      <h2>Update password</h2>
      <UpdatePasswordForm />
    </Box>
  );
}
