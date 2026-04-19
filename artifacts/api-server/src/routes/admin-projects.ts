import { Router } from "express";
import pg from "pg";
import { requireAuth } from "../middlewares/auth";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = Router();

// All routes in this file require authentication
router.use(requireAuth);

const BUILTIN_KEYS = ["unity", "sham", "tameeni", "wiqaya"] as const;

const BUILTIN_PROJECTS = [
  { key: "unity",   label: "Unity Bank",  apiBase: "/api/unity",   sitePath: "/unity-bank/",  builtin: true },
  { key: "sham",    label: "Sham Cash",   apiBase: "/api/sham",    sitePath: "/sham-cash/",   builtin: true },
  { key: "tameeni", label: "Tameeni",     apiBase: "/api/tameeni", sitePath: "/tameeni/",     builtin: true },
  { key: "wiqaya",  label: "Wiqaya",      apiBase: "/api/wiqaya",  sitePath: "/wiqaya/",      builtin: true },
];

/** GET /api/admin/projects — list built-in + custom projects */
router.get("/projects", async (_req, res) => {
  try {
    await ensureTable();
    const { rows } = await pool.query<{
      key: string; label: string; api_base: string; site_path: string;
    }>(
      `SELECT key, label, api_base, site_path FROM admin_projects ORDER BY created_at ASC`
    );
    const custom = rows.map((r) => ({
      key: r.key,
      label: r.label,
      apiBase: r.api_base,
      sitePath: r.site_path,
      builtin: false,
    }));
    res.json([...BUILTIN_PROJECTS, ...custom]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/** POST /api/admin/projects — add a custom project */
router.post("/projects", async (req, res) => {
  const { key, label, apiBase, sitePath } = req.body as {
    key?: string; label?: string; apiBase?: string; sitePath?: string;
  };

  if (!key || !label || !apiBase) {
    res.status(400).json({ error: "key, label, and apiBase are required" });
    return;
  }

  if ((BUILTIN_KEYS as readonly string[]).includes(key)) {
    res.status(409).json({ error: "A built-in project with that key already exists" });
    return;
  }

  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO admin_projects (key, label, api_base, site_path)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, api_base = EXCLUDED.api_base, site_path = EXCLUDED.site_path`,
      [key, label, apiBase, sitePath ?? ""]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/** DELETE /api/admin/projects/:key — remove a custom project (not built-ins) */
router.delete("/projects/:key", async (req, res) => {
  const { key } = req.params;

  if ((BUILTIN_KEYS as readonly string[]).includes(key)) {
    res.status(403).json({ error: "Cannot delete a built-in project" });
    return;
  }

  try {
    await ensureTable();
    await pool.query(`DELETE FROM admin_projects WHERE key = $1`, [key]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_projects (
      id          SERIAL PRIMARY KEY,
      key         TEXT UNIQUE NOT NULL,
      label       TEXT NOT NULL,
      api_base    TEXT NOT NULL,
      site_path   TEXT NOT NULL DEFAULT '',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export default router;
