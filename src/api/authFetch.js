import { getToken, isTokenExpired, clearSession } from "../utils/auth";

// fetch con Authorization automático; ante token vencido/ausente o 401 del
// backend, limpia la sesión y redirige a /login
export async function authFetch(url, options = {}) {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearSession();
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearSession();
    window.location.href = "/login";
  }

  return response;
}
