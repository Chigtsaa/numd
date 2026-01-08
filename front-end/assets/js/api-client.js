export const API_BASE = "http://localhost:3000";

export function apiFetch(path, options) {
  if (!path) throw new Error("apiFetch: path is required");
  const normalized = path.startsWith("/")
    ? `${API_BASE}${path}`
    : `${API_BASE}/${path}`;
  return fetch(normalized, options);
}
