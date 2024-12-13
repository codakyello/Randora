"use client";

import useUser from "../_hooks/useUser";
import Spinner from "./Spinner";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateUserForm from "./UpdateUserForm";

export default function UpdateUserPasswordForm() {
  const { data: user, isLoading, error } = useUser();
  if (isLoading) return <Spinner />;
  if (error) return null;

  return (
    <>
      <h2>Update user data</h2>
      <UpdateUserForm user={user} />

      <h2>Update password</h2>
      <UpdatePasswordForm />
    </>
  );
}
