const API_BASE_URL = "http://localhost:8000";

export function getAuthToken() {
  try {
    return sessionStorage.getItem("authToken");
  } catch (e) {
    return null;
  }
}

export function setAuthSession(token, role, name, userId) {
  try {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("authRole", role);
    sessionStorage.setItem("authName", name);
    sessionStorage.setItem("authUserId", userId);
  } catch (e) {}
}

export function clearAuthSession() {
  try {
    ["authToken", "authRole", "authName", "authUserId"].forEach((k) =>
      sessionStorage.removeItem(k),
    );
  } catch (e) {}
}

export function getAuthRole() {
  try {
    return sessionStorage.getItem("authRole");
  } catch (e) {
    return null;
  }
}

export function getAuthName() {
  try {
    return sessionStorage.getItem("authName");
  } catch (e) {
    return null;
  }
}

export async function apiFetch(
  path,
  { method = "GET", body, isForm = false } = {},
) {
  const headers = {};
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function apiLogin(username, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { username, password },
  });
  setAuthSession(data.access_token, data.role, data.name, data.user_id);
  return data;
}
