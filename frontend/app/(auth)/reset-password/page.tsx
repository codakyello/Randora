import ResetPassword from "@/app/_components/ResetPassword";
import { verifyResetToken } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Reset Password",
};
export default async function Page({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  // validate the token first

  const tokenVerified = await verifyResetToken(token);

  if (!tokenVerified) return notFound();

  return <ResetPassword token={token} />;
}
