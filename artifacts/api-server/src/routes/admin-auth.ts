import { Router } from "express";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import {
  makeSessionToken,
  verifySessionToken,
  requireAuth,
  SESSION_COOKIE,
} from "../middlewares/auth";
import type { Request, Response } from "express";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/",
};

// ── Simple in-memory rate limiter for login ───────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Timing-safe string comparison to prevent leaking valid emails via timing
function safeEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b.padEnd(a.length, "\0"));
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf) && a.length === b.length;
  } catch {
    return false;
  }
}

/** POST /api/admin/login */
router.post("/login", async (req: Request, res: Response) => {
  const ip = (req.headers["x-forwarded-for"] as string) ?? req.socket.remoteAddress ?? "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many login attempts. Try again in 15 minutes." });
    return;
  }

  const { email, password } = req.body as { email?: string; password?: string };

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminHashEnv = process.env.ADMIN_PASSWORD_HASH ?? "";

  if (!adminEmail || !adminHashEnv) {
    res.status(503).json({
      error: "Server not configured: ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in .env",
    });
    return;
  }

  if (!email || !password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const emailMatches = safeEqual(
    email.trim().toLowerCase(),
    adminEmail.trim().toLowerCase()
  );

  // Always run bcrypt.compare even if email doesn't match (prevent timing-based email enumeration)
  const hashToCompare = emailMatches ? adminHashEnv : "$2b$10$invalidhashfortimingXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const passwordMatches = await bcrypt.compare(password, hashToCompare);

  if (!emailMatches || !passwordMatches) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  clearAttempts(ip);
  const token = makeSessionToken(email.trim().toLowerCase());
  res.cookie(SESSION_COOKIE, token, COOKIE_OPTS);
  res.json({ ok: true });
});

/** POST /api/admin/logout */
router.post("/logout", (_req, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ ok: true });
});

/** GET /api/admin/me — returns 200 if authenticated */
router.get("/me", requireAuth, (req: Request, res: Response) => {
  const token = (req as any).cookies?.[SESSION_COOKIE] as string;
  const email = verifySessionToken(token) ?? "";
  res.json({ ok: true, email });
});

export default router;
