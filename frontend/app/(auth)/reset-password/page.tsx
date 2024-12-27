import ResetPassword from "@/app/_components/ResetPassword";
import { verifyResetToken } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

async function Page({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  // validate the token first

  const tokenVerified = await verifyResetToken(token);

  console.log(tokenVerified);

  if (!tokenVerified) return notFound();

  return <ResetPassword token={token} />;
}

export default Page;
