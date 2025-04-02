"use server";

import { revalidatePath } from "next/cache";
import { RESULTS_PER_PAGE } from "../_utils/constants";
import { getToken } from "../_utils/serverUtils";
import { SettingsRandora } from "../_utils/types";

const URL = "https://randora-11b23c2bb02d.herokuapp.com/api/v1";
// const DEV_URL = "http://localhost:5000/api/v1";

export async function getOrganisation(organisationId: string | undefined) {
  const token = await getToken();

  try {
    const res = await fetch(`${URL}/organisations/${organisationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      data: { organisation },
    } = data;

    return organisation;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getUser() {
  const token = await getToken();

  try {
    const res = await fetch(`${URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 0,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      data: { user },
    } = data;
    return user;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
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
  const image = formData.get("image");
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
        image,
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

export async function authenticate(token: string) {
  try {
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${URL}/users/verify-auth-token`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      next: {
        revalidate: 0,
      },
    });
    if (!res.ok) throw new Error("");
    const data = await res.json();
    console.log(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function verifyResetToken(token: string) {
  try {
    if (!token) return false;

    const res = await fetch(`${URL}/users/verify-reset-token?token=${token}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 0,
      },
    });
    if (!res.ok) throw new Error("");

    return true;
  } catch (err) {
    console.log(err);
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

export async function updateUser(formData: {
  email?: string;
  userName?: string;
  image?: string | undefined;
  organisationId?: string;
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
      next: { revalidate: 0 },

      body: JSON.stringify(formData),
    });

    const data = await res.json();

    statusCode = res.status;
    // Check if the response was successful
    if (!res.ok) throw new Error(data.message);

    // Destructure token and user from response
    const {
      data: { user },
    } = data;

    console.log(user);

    revalidatePath("/dashboard");
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
  const token = await getToken();

  if (!token) return;

  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}&sort=-createdAt`;

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

  try {
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

    return { events, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getUpcomingEvents() {
  const token = await getToken();

  if (!token) return;

  try {
    const res = await fetch(
      `${URL}/users/me/events?status=inactive&sort=-startDate`,
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
      data: { events },
    } = data;

    return events;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getAllEvents() {
  const token = await getToken();

  if (!token) return;

  try {
    const res = await fetch(
      `${URL}/users/me/events?sort=startDate&status=active,completed&limit=1000000`,
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
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getEvent(eventId: string) {
  let statusCode;
  try {
    const token = await getToken();

    if (!token) return;

    const res = await fetch(`${URL}/events/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;

    if (!res.ok) {
      throw new Error(data.message);
    }

    const {
      data: { event },
    } = data;

    return { event };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

export async function getEventParticipants(
  eventId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  let statusCode;
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

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { participants },
    } = data;

    return { participants, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

export async function getEventAllParticipants(eventId: string) {
  let statusCode;

  const token = await getToken();
  if (!token) return;

  try {
    const res = await fetch(`${URL}/events/${eventId}/all-participants`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { participants },
    } = data;

    return { participants, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

export async function getEventWinners(eventId: string) {
  let statusCode;

  const token = await getToken();
  if (!token) return;

  try {
    const res = await fetch(`${URL}/events/${eventId}/winners`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { participants },
    } = data;

    return { participants, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
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
  let statusCode;
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

  try {
    const res = await fetch(`${URL}/events/${eventId}/prizes${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { prizes },
    } = data;

    return { prizes, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

export async function getEventOrganisation(organisationId: string | undefined) {
  const token = await getToken();
  if (!token) return;
  try {
    const res = await fetch(`${URL}/organisations/${organisationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      data: { organisation },
    } = data;

    return organisation;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getAllEventPrizes(eventId: string) {
  const token = await getToken();
  if (!token) return;
  let statusCode;

  try {
    const res = await fetch(`${URL}/events/${eventId}/all-prizes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { prizes },
    } = data;

    return { prizes, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

// function to get all collaborators
export async function getAllCollaborators(organisationId: string | undefined) {
  const token = await getToken();
  if (!token) return;

  try {
    const res = await fetch(
      `${URL}/organisations/${organisationId}/collaborators`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

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

export async function validateInviteToken(
  organisationId: string,
  token: string
) {
  let statusCode;
  try {
    const res = await fetch(
      `${URL}/organisations/${organisationId}/collaborators/invite?token=${token}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    statusCode = res.status;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const {
      data: { owner, invite },
    } = data;

    return { owner, invite };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return {
        status: "error",
        statusCode,
        message: "An unknown error occurred",
      };
    }
  }
}

export async function respondToInvite(
  organisationId: string,
  token: string,
  accept: boolean
) {
  try {
    const res = await fetch(
      `${URL}/organisations/${organisationId}/collaborators/respond?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accept }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return {
        status: "error",
        message: "An unknown error occurred",
      };
    }
  }
}

export async function updateOrganisation(
  settings: SettingsRandora,
  organisationId: string
) {
  try {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${URL}/organisations/${organisationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    revalidatePath("/dashboard/settings");
    return { status: "success", data };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}
