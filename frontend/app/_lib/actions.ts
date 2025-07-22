"use client";

import { EventForm, ParticipantForm, PrizeForm, User } from "../_utils/types";

// const URL = "https://randora-11b23c2bb02d.herokuapp.com/api/v1";
const URL = "https://randora-backend.vercel.app/api/v1";
// const DEV_URL = "http://localhost:5000/api/v1";

export async function createParticipant({
  participantForm,
  token,
}: {
  participantForm: ParticipantForm;
  token: string | null;
}) {
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
  const {
    data: { participant },
  } = data;

  return participant;
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

export async function createPrizes({
  prizeForm,
  token,
}: {
  prizeForm: PrizeForm[];
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

export async function sendInvite({
  organisationId,
  user,
  token,
}: {
  organisationId: string;
  user: User | null;
  token: string | null;
}) {
  // wrap in try catch

  const res = await fetch(
    `${URL}/organisations/${organisationId}/collaborators/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteCollaborator({
  organisationId,
  collaboratorId,
  token,
}: {
  organisationId: string;
  collaboratorId: string;
  token: string | null;
}) {
  const res = await fetch(
    `${URL}/organisations/${organisationId}/collaborators/${collaboratorId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function assignPrize({
  prizeId,
  participantId,
  token,
}: {
  prizeId: string;
  participantId: string;
  token: string | null;
}) {
  const res = await fetch(`${URL}/prizes/${prizeId}/assign-price`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ participantId }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { participant },
  } = data;

  console.log(participant);

  return participant;
}

export async function createTransaction(
  token: string | null,
  {
    userId,
    currency,
    amount,
    paymentMethod,
    paymentFor,
  }: {
    userId: string;
    currency: string;
    amount: number;
    paymentMethod: string;
    paymentFor: string;
  }
) {
  const res = await fetch(`${URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      currency,
      amount,
      paymentMethod,
      paymentFor,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { transaction },
  } = data;

  return transaction;
}

export async function convertCurrency({
  amount,
  from,
  to,
}: {
  amount: number;
  from: string;
  to: string;
}) {
  const res = await fetch(`https://api.spendjuice.com/exchange/convert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, from, to }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  console.log(data);

  const {
    data: { converted_amount },
  } = data;
  return converted_amount;
}

export async function processTransaction({
  reference,
  eventType,
}: {
  reference: string;
  eventType: "payment.session.succeded" | "payment.session.failed";
}) {
  const res = await fetch(`${URL}/transactions/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reference, eventType }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}
