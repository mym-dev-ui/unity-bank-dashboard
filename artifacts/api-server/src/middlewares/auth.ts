import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is required");
  return s;
}

/** Build a signed session token: base64url(email:ts).hmacHex */
export function makeSessionToken(email: string): string {
  const payload = `${email}:${Date.now()}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

/** Verify a session token. Returns email if valid, null otherwise. */
export function verifySessionToken(token: string): string | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot < 0) return null;
    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const expected = createHmac("sha256", getSecret()).update(payloadB64).digest("hex");

    // Both must be the same byte length for timingSafeEqual
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const colonIdx = payload.lastIndexOf(":");
    if (colonIdx < 0) return null;
    const email = payload.slice(0, colonIdx);
    const ts = Number(payload.slice(colonIdx + 1));
    if (!email || !ts || Date.now() - ts > SESSION_TTL_MS) return null;

    return email;
  } catch {
    return null;
  }
}

/** Express middleware — 401 if no valid session cookie. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token || !verifySessionToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export { SESSION_COOKIE };
