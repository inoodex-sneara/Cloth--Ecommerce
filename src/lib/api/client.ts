export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** Best user-facing message: first field error if present, else general message. */
export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const first = Object.values(err.errors)[0]?.[0];
    if (first) return first;
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  cache?: RequestCache;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, token, cache } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    cache,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let errors: Record<string, string[]> = {};
    try {
      const data = await res.json();
      message = data.message || message;
      if (data.errors && typeof data.errors === "object") {
        errors = Object.fromEntries(
          Object.entries(data.errors).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.map(String) : [String(v)],
          ])
        );
      }
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, message, errors);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
