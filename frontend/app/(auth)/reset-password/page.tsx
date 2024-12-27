import ResetPassword from "@/app/_components/ResetPassword";

function Page({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  // validate the token first

  return <ResetPassword token={token} />;
}

export default Page;
