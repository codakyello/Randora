"use client";
import { useAuth } from "../_contexts/AuthProvider";
import SpinnerFull from "./SpinnerFull";

export default function Pricing() {
  const { isAuthenticating, user } = useAuth();

  console.log(user);

  if (isAuthenticating) return <SpinnerFull />;

  return (
    <div>
      <h1>Pricing</h1>
    </div>
  );
}
