const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (path.startsWith("/api/")) {
    return fetch(`${API_BASE_URL}${path}`, init);
  }

  return fetch(path, init);
}
