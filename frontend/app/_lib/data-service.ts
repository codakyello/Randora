"use server";
// import { notFound } from "next/navigation";
// import { eachDayOfInterval } from "date-fns";

import { revalidatePath } from "next/cache";
import { Setting } from "../_components/UpdateSettingsForm";
import { RESULTS_PER_PAGE } from "../_utils/constants";
// import { notFound } from "next/navigation";
// import { EventForm, ParticipantForm } from "../_utils/types";
import { getToken } from "../_utils/serverUtils";
import { User } from "../_utils/types";

const URL = "https://mega-draw.vercel.app/api/v1";
const DEV_URL = "http://localhost:5000/api/v1";

// /////////////
// // AUTH

export async function getSettings() {
  try {
    const res = await fetch(`${URL}/settings`);

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Settings couldnt load");

    const {
      data: { settings },
    } = data;
    return settings;
  } catch (err) {
    throw err;
  }
}

export async function updateSetting(data: Partial<Setting>, token: string) {
  if (!token) return;
  try {
    const res = await fetch(`${URL}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Send the serialized data
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Failed to update settings");

    const {
      data: { settings },
    } = result;

    revalidatePath("/dashboard/settings");
    return settings;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "An unknown error occured" };
  }
}

export async function login(formData: FormData) {
  // Safely extract email and password
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  // Validate that email and password are not null
  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  console.log(email, password);

  try {
    const res = await fetch(`${URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Login failed");

    return data;

    // Destructure token and user from response
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function signUp(formData: FormData, accountType: string) {
  const email = formData.get("email");
  const password = formData.get("password");
  const userName = formData.get("userName");
  const confirmPassword = formData.get("confirmPassword");
  const organisationName = formData.get("organisationName");

  let res;
  try {
    // const token = getToken
    res = await fetch(`${URL}/users/signUp`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        userName,
        confirmPassword,
        accountType,
        organisationName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Signup failed");

    // Destructure token and user from response
    return data;
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode: res?.status, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await fetch(`${URL}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function resetPassword({
  password,
  confirmPassword,
  token,
}: {
  password: string;
  confirmPassword: string;
  token: string;
}) {
  try {
    const res = await fetch(`${URL}/users/reset-password?token=${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
  }
}

export async function authorize(token: string) {
  try {
    if (!token) return false;

    const res = await fetch(`${URL}/verifyToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("");
    return true;
  } catch {
    return false;
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const res = await fetch(`${URL}/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
  }
}

export async function resendOtp(email: string) {
  try {
    const res = await fetch(`${URL}/users/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: unknown) {
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getUser() {
  const token = await getToken();
  let statusCode;
  try {
    const res = await fetch(`${URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      data: { user },
    } = data;
    return user;
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function updateUser(formData: {
  email: FormDataEntryValue;
  userName: FormDataEntryValue;
  image?: string | undefined;
}) {
  let statusCode;

  const token = await getToken();
  try {
    const res = await fetch(`${URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    statusCode = res.status;
    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Signup failed");

    // Destructure token and user from response
    const {
      data: { user },
    } = data;

    revalidatePath("/dashboard/account");
    return user;
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function updatePassword(passwordForm: {
  currPassword: FormDataEntryValue;
  password: FormDataEntryValue;
  confirmPassword: FormDataEntryValue;
}) {
  let statusCode;
  const token = await getToken();
  try {
    const res = await fetch(`${URL}/users/update-my-password`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordForm),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update password");

    const {
      data: { admin },
      token: adminToken,
    } = data;

    return { admin, token: adminToken };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getMyEvents(searchParams: {
  page: string | null;
  status: string | null;
  sortBy: string | null;
}) {
  console.log("in here");
  const token = await getToken();

  console.log(token);
  if (!token) return;

  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}&sort=-createdAt`;

  console.log(query);
  // Filter
  if (status && status !== "all") query += `&status=${status}`;

  // Sort, highest participant,
  switch (sort) {
    case "startDate-desc":
      query += "&sort=-startDate";
      break;
    case "startDate-asc":
      query += "&sort=startDate";
      break;
    case "participants-desc":
      query += "&sort=-participantCount";
      break;
    case "participants-asc":
      query += "&sort=participantCount";
      break;
    default:
      query += "&sort=-createdAt";
  }

  const res = await fetch(`${URL}/users/me/events${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  const {
    totalCount,
    results,
    data: { events },
  } = data;

  console.log(events);

  return { events, totalCount, results };
}

export async function getAllEvents() {
  const token = await getToken();

  console.log(token);
  if (!token) return;

  const res = await fetch(
    `${URL}/users/me/events?sort=startDate&status=active,completed`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  const {
    totalCount,
    results,
    data: { events },
  } = data;

  return { events, totalCount, results };
}

export async function getEvent(eventId: string) {
  const token = await getToken();

  console.log(token);
  if (!token) return;

  const res = await fetch(`${URL}/users/me/events/${eventId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  const {
    totalCount,
    results,
    data: { events },
  } = data;

  return { events, totalCount, results };
}

export async function getEventParticipants(
  eventId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

  // Filter
  if (status && status === "winners") query += `&isWinner=true`;

  // Sort, highest participant,
  switch (sort) {
    case "createdDate-desc":
      query += "&sort=-createdAt";
      break;
    case "createdDate-asc":
      query += "&sort=createdAt";
      break;
    case "ticketNumber-desc":
      query += "&sort=-ticketNumber";
      break;
    case "ticketNumber-asc":
      query += "&sort=ticketNumber";
      break;
    default:
      query += "&sort=-createdAt";
  }

  const token = await getToken();
  if (!token) return;

  try {
    const res = await fetch(`${URL}/events/${eventId}/participants${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { participants },
    } = data;

    return { participants, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getEventPrizes(
  eventId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  const token = await getToken();
  if (!token) return;

  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

  // Filter

  if (status && status !== "all") query += `&status=${status}`;

  // Sort, highest participant,
  switch (sort) {
    case "createdDate-desc":
      query += "&sort=-createdAt";
      break;
    case "createdDate-asc":
      query += "&sort=createdAt";
      break;
    case "quantity-desc":
      query += "&sort=-quantity";
      break;
    case "quantity-asc":
      query += "&sort=quantity";
      break;
  }

  console.log(query);

  try {
    const res = await fetch(`${URL}/events/${eventId}/prizes${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { prizes },
    } = data;

    return { prizes, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

// function to get all collaborators
export async function getAllCollaborators(
  organisationId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

  // Filter
  if (status && status === "winners") query += `&isWinner=true`;

  // Sort, highest participant,
  switch (sort) {
    case "createdDate-desc":
      query += "&sort=-createdAt";
      break;
    case "createdDate-asc":
      query += "&sort=createdAt";
      break;
    case "ticketNumber-desc":
      query += "&sort=-ticketNumber";
      break;
    case "ticketNumber-asc":
      query += "&sort=ticketNumber";
      break;
    default:
      query += "&sort=-createdAt";
  }

  const token = await getToken();
  if (!token) return;

  console.log(organisationId);
  try {
    const res = await fetch(
      `${DEV_URL}/organisations/${organisationId}/collaborators?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    console.log("The data", data);

    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { collaborators },
    } = data;

    return { collaborators, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}
