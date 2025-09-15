import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("inside here"); // will show in server logs only
    const res = await fetch("https://api.example.com/events/123");

    if (!res.ok) throw new Error("Fetch failed");

    const event = await res.json();

    return NextResponse.json(event);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Event could not be found" },
      { status: 404 }
    );
  }
}
