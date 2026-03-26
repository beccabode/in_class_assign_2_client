const API_BASE_URL = "http://localhost:3000";

export async function sendRequest(
  endpoint: string,
  method: string,
  body?: unknown,
  token?: string
) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}