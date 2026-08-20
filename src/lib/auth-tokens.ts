const ACCESS_TOKEN_KEY = "komme.accessToken";
const REFRESH_TOKEN_KEY = "komme.refreshToken";

// ponytail: localStorage only. httpOnly cookie is the safer default against XSS, but
// FE/BE deploy to different domains — that forces SameSite=None, which reopens CSRF and
// risks Safari ITP silently blocking the cookie as third-party. Don't just ask backend to
// Set-Cookie: if cookie auth happens, route it through a same-origin BFF proxy (same
// pattern as src/app/api/reverse-geocode/route.ts) so the browser only ever holds a
// same-site cookie and the backend's Bearer contract doesn't have to change. First check
// whether FE/BE end up as sibling subdomains of one root domain — if so this is moot,
// SameSite=Lax just works. Revisit before production launch either way.
export function saveAuthTokens(tokens: { accessToken: string; refreshToken: string }): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
