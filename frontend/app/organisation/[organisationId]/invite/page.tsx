import Invite from "@/app/_components/Invite";
import { validateInviteToken } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Invite",
};

export default async function Page({
  params: { organisationId },
  searchParams: { token },
}: {
  params: { organisationId: string };
  searchParams: { token: string };
}) {
  const data = await validateInviteToken(organisationId, token);

  if (data.statusCode === 404) return notFound();

  if (!data) return null;

  const { owner, invite } = data;

  return (
    <Invite
      owner={owner}
      invite={invite}
      token={token}
      organisationId={organisationId}
    />
  );
}
