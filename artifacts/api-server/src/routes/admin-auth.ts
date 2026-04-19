import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  makeSessionToken,
  verifySessionToken,
  requireAuth,
  SESSION_COOKIE,
} from "../middlewares/auth";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/",
};

/** POST /api/admin/login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashEnv = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHashEnv) {
    res.status(503).json({
      error: "Server not configured: ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in .env",
    });
    return;
  }

  if (
    !email ||
    !password ||
    email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const match = await bcrypt.compare(password, adminHashEnv);
  if (!match) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = makeSessionToken(email.trim().toLowerCase());
  res.cookie(SESSION_COOKIE, token, COOKIE_OPTS);
  res.json({ ok: true });
});

/** POST /api/admin/logout */
router.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ ok: true });
});

/** GET /api/admin/me — returns 200 if authenticated */
router.get("/me", requireAuth, (req, res) => {
  const token = (req as any).cookies?.[SESSION_COOKIE] as string;
  const email = verifySessionToken(token) ?? "";
  res.json({ ok: true, email });
});

export default router;
