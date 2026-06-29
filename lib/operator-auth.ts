import { createHmac, timingSafeEqual } from "node:crypto";

// Demo operator auth: any credentials sign you in as the demo operator. The
// operator id is stored in this cookie so the dashboard can gate access and
// load real data. Not real auth (login ignores credentials) — but the cookie is
// HMAC-signed so its value can't be tampered to impersonate another operator.
export const OPERATOR_COOKIE = "operator_session";
export const DEMO_OPERATOR_ID = "op-west-1";

// In production, set OPERATOR_SESSION_SECRET. The dev fallback is intentionally
// obvious so an unset secret is never mistaken for real security.
const SECRET = process.env.OPERATOR_SESSION_SECRET ?? "dev-only-insecure-operator-secret";

function sign(operatorId: string) {
  return createHmac("sha256", SECRET).update(operatorId).digest("hex");
}

export function signOperatorSession(operatorId: string) {
  return `${operatorId}.${sign(operatorId)}`;
}

// Returns the operator id only if the signature is valid, else null.
export function verifyOperatorSession(value: string | undefined): string | null {
  if (!value) return null;
  const idx = value.lastIndexOf(".");
  if (idx <= 0) return null;

  const operatorId = value.slice(0, idx);
  const provided = Buffer.from(value.slice(idx + 1));
  const expected = Buffer.from(sign(operatorId));

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }
  return operatorId;
}
