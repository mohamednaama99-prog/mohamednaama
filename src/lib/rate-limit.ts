import "server-only";

/**
 * A best-effort, per-IP limit on application submissions: 5 per 10 minutes.
 *
 * It lives in the memory of one server instance, so on Vercel each function
 * instance counts on its own and a cold start begins at zero. That is enough
 * to stop a single client hammering the form, without a database or a paid
 * service. The Vercel Firewall rule described in docs/launch-handoff.md is the
 * edge layer in front of it.
 */

export const SUBMISSION_LIMIT = 5;
export const SUBMISSION_WINDOW_MS = 10 * 60 * 1000;

/** Bounds memory if many distinct addresses arrive within one window. */
const MAX_TRACKED = 5_000;

const attempts = new Map<string, number[]>();

/**
 * The client's address, from the headers Vercel sets. Vercel overwrites
 * `x-forwarded-for` and `x-real-ip` at its edge, so a client cannot spoof
 * them there; on any other host they would be client-controlled.
 */
export function clientIp(headers: Headers): string {
  const forwarded =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("x-forwarded-for") ??
    headers.get("x-real-ip") ??
    "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

/** Records one attempt and says whether it is within the limit. */
export function allowSubmission(ip: string, now = Date.now()): boolean {
  const since = now - SUBMISSION_WINDOW_MS;
  const recent = (attempts.get(ip) ?? []).filter((time) => time > since);

  if (recent.length >= SUBMISSION_LIMIT) {
    attempts.set(ip, recent);
    return false;
  }

  recent.push(now);
  attempts.delete(ip);
  attempts.set(ip, recent);

  /* Map keeps insertion order, and a key is re-inserted on every attempt, so
     the first keys are the least recently seen. */
  while (attempts.size > MAX_TRACKED) {
    const oldest = attempts.keys().next().value;
    if (oldest === undefined) break;
    attempts.delete(oldest);
  }

  return true;
}
