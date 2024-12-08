"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/login");
  return token;
}
