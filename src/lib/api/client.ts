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
 * validated at runtime — the backend isn't deployed yet (no live Swagger to check
 * against), so this is what catches the response silently drifting from the Notion spec.
 */
export async function apiFetch<T>(path: string, dataSchema: ZodType<T>, init?: RequestInit): Promise<T> {
  // Normalize via Headers so a Headers instance or [key, value][] tuple array in
  // init.headers merges correctly — a plain object spread silently drops those.
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await fetch(path, { ...init, headers });
  const body = await res.json();
  if (!res.ok || !body.isSuccess) {
    throw new ApiError(body.code ?? "UNKNOWN", body.message ?? "Request failed");
  }
  return dataSchema.parse(body.data);
}
