"use client";

import { EventForm, ParticipantForm, PrizeForm } from "../_utils/types";

const URL = "https://mega-draw.vercel.app/api/v1";
// const DEV_URL = "http://localhost:5000/api/v1";

export async function createParticipant({
  participantForm,
  token,
}: {
  participantForm: ParticipantForm;
  token: string | null;
}) {
  console.log(participantForm);
  const res = await fetch(`${URL}/participants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(participantForm),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    totalCount,
    results,
    data: { participants },
  } = data;

  return { participants, totalCount, results };
}

export async function uploadParticipants({
  formData,
  token,
}: {
  formData: FormData;
  token: string | null;
}) {
  console.log(token);
  const res = await fetch(`${URL}/participants/upload`, {
    method: "POST",
    body: formData,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { participants },
  } = data;

  return participants;
}

export async function updateParticipant({
  participantId,
  participantForm,
  token,
}: {
  participantId: string;
  participantForm: ParticipantForm;
  token: string | null;
}) {
  const res = await fetch(`${URL}/participants/${participantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(participantForm),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return { status: "success" };
}

export async function deleteParticipant({
  participantId,
  token,
}: {
  participantId: string;
  token: string | null;
}) {
  try {
    const res = await fetch(`${URL}/participants/${participantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return { status: "success" };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function createEvent({
  eventData,
  token,
}: {
  eventData: EventForm;
  token: string | null;
}) {
  const res = await fetch(`${URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { event },
  } = data;

  return event;
}

export async function updateEvent({
  eventId,
  eventData,
  token,
}: {
  eventId: string;
  eventData: EventForm;
  token: string | null;
}) {
  const res = await fetch(`${URL}/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
}

export async function deleteEvent({
  token,
  eventId,
}: {
  token: string | null;
  eventId: string;
}) {
  console.log(eventId);

  console.log(token);

  const res = await fetch(`${URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
}

export async function createPrize({
  prizeForm,
  token,
}: {
  prizeForm: PrizeForm;
  token: string | null;
}) {
  const res = await fetch(`${URL}/prizes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prizeForm),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { prize },
  } = data;

  return prize;
}

export async function updatePrize({
  prizeId,
  prizeForm,
  token,
}: {
  prizeId: string;
  prizeForm: PrizeForm;
  token: string | null;
}) {
  const res = await fetch(`${URL}/prizes/${prizeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prizeForm),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  const {
    data: { prize },
  } = data;

  return prize;
}

export async function deletePrize({
  prizeId,
  token,
}: {
  prizeId: string;
  token: string | null;
}) {
  const res = await fetch(`${URL}/prizes/${prizeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return { status: "success" };
}
