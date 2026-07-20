// Decodifica el payload de un JWT sin validar la firma (solo lectura del exp)
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function clearSession() {
  localStorage.removeItem("token");
}

// true solo si hay token y no está vencido; limpia sesiones vencidas al pasar
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    clearSession();
    return false;
  }

  return true;
}
