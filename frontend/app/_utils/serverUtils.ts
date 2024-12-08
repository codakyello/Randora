"use server";
import { SettingsRandora } from "@/app/_utils/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/login");
  return token;
}

export async function getUserSettings(token: string | undefined) {
  try {
    const res = await fetch(`${URL}/users/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch settings");

    const data = await res.json();
    return { status: "success", data };
  } catch (error) {
    return {
      status: "error",
      data: error instanceof Error ? error.message : "Failed to fetch settings",
    };
  }
}

export async function updateUserSettings(
  settings: SettingsRandora,
  token: string | undefined
) {
  try {
    const res = await fetch(`${URL}/users/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    if (!res.ok) throw new Error("Failed to update settings");

    const data = await res.json();
    return { status: "success", data };
  } catch (error) {
    return {
      status: "error",
      data:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}
