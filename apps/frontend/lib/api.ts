// Every request in StatusForge flows through here — once.
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

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
  if (res.status === 401) return handle401<T>(endpoint, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? "Request failed");
  }
  return res.json();
}

// Serialises concurrent 401s — only one refresh fires at a time.
async function handle401<T>(endpoint: string, init?: RequestInit): Promise<T> {
  if (!isRefreshing) {
    isRefreshing = true;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      isRefreshing = false;
      refreshQueue.forEach((r) => r());
      refreshQueue.length = 0;
    });
  } else {
    // Queue up — wait for the in-flight refresh to finish, then retry.
    await new Promise<void>((res) => refreshQueue.push(res));
  }
  return apiFetch<T>(endpoint, init);
}
