"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// export const metadata = {
//   title: "Randora",
//   description:
//     "Create and manage raffles, spin-the-wheel, and giveaways with our platform. Upload thousands of participants via CSV, track results in an analytics dashboard, and send bulk emails—all under flexible pricing tiers.",
// };

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return null;
}
