const ACCESS_TOKEN_KEY = "komme.accessToken";
const REFRESH_TOKEN_KEY = "komme.refreshToken";

// ponytail: localStorage only, no httpOnly cookie / refresh-on-expiry scheduling —
// upgrade when a protected route or SSR auth check actually needs it.
export function saveAuthTokens(tokens: { accessToken: string; refreshToken: string }): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
