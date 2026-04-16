const BASE = "/api/sham";

async function req(method: string, path: string, body?: unknown) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const adminApi = {
  getSubmissions: () => req("GET", "/submissions"),
  patchSubmission: (id: string, data: Record<string, unknown>) => req("PATCH", `/submissions/${id}`, data),
  deleteSubmission: (id: string) => req("DELETE", `/submissions/${id}`),
  deleteAll: () => req("DELETE", "/submissions"),
  sendCmd: (visitorId: string, command: string) => req("POST", "/cmd", { visitorId, command }),
};
