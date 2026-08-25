import type { ZodType } from "zod";

// Every KOMME API responds with the same envelope (Notion "코메 API 명세서"):
// { isSuccess, code, message, data }. ApiError carries the `code` so callers can
// branch on specific failures (e.g. "AUTH_401_1") without re-parsing the body.
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Calls a KOMME API endpoint and parses `data` against `dataSchema`. Only `data` is
 * validated at runtime — this is what catches the real backend's response silently
 * drifting from the swagger/Notion spec this client was written against.
 */
export async function apiFetch<T>(path: string, dataSchema: ZodType<T>, init?: RequestInit): Promise<T> {
  // Normalize via Headers so a Headers instance or [key, value][] tuple array in
  // init.headers merges correctly — a plain object spread silently drops those.
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  // NEXT_PUBLIC_API_BASE_URL points at the real backend (see .env.local). In dev, MSW
  // only intercepts same-origin relative requests, so once this is set requests bypass
  // MSW and hit the real backend directly — onUnhandledRequest: "bypass" lets them through.
  // Strip a trailing slash so a base URL set with one doesn't produce "//api/..." — path
  // always starts with "/".
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  const res = await fetch(baseUrl + path, { ...init, headers });
  const body = await res.json();
  if (!res.ok || !body.isSuccess) {
    throw new ApiError(body.code ?? "UNKNOWN", body.message ?? "Request failed");
  }
  return dataSchema.parse(body.data);
}
