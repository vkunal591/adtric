const tokenStorageKey = "admin_token";

export function saveAdminToken(token: string) {
  window.localStorage.setItem(tokenStorageKey, token);
  document.cookie = `${tokenStorageKey}=1; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function clearAdminToken() {
  window.localStorage.removeItem(tokenStorageKey);
  document.cookie = `${tokenStorageKey}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAdminToken() {
  return window.localStorage.getItem(tokenStorageKey);
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAdminToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
    credentials: "include"
  });
}
