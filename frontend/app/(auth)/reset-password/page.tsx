import ResetPassword from "@/app/_components/ResetPassword";

function Page({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams;
  return <ResetPassword token={token} />;
}

export default Page;
