import { ApiError } from "./api-error";

let isRefreshing = false;
const refreshQueue: Array<() => void> = [];

export async function apiFetch<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}${endpoint}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  // if (res.status === 401) return handle401<T>(endpoint, init);
  if (endpoint == "/user/login" && res.status === 401)
    throw new ApiError("Invalid Login Credentials", 401, "INVALID_CREDENTIALS");
  else if (res.status === 401) return handle401<T>(endpoint, init);
  console.log(res.ok);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.message ?? "Request failed", res.status, body.code);
  }
  if(res.status === 204){
    return null
  }
  return res.json();
}

async function handle401<T>(endpoint: string, init?: RequestInit): Promise<T> {
  if (endpoint === "/auth/refresh") {
    throw new Error("Refresh token request failed");
  }

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!refreshResponse.ok) {
        throw new Error("Session expired");
      }
    } finally {
      isRefreshing = false;

      refreshQueue.forEach((resolve) => resolve());
      refreshQueue.length = 0;
    }
  } else {
    await new Promise<void>((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  // Retry original request once after successful refresh
  return apiFetch<T>(endpoint, init);
}
