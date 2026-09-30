import { getStore } from "@netlify/blobs";

export const buyers = () => getStore({ name: "compradoras", consistency: "strong" });
export const sessions = () => getStore({ name: "sesiones", consistency: "strong" });
export const events = () => getStore({ name: "eventos" });

export const MAX_DISPOSITIVOS = 2;
export const COOKIE = "pr_sesion";

export function normEmail(e) {
  return String(e || "").trim().toLowerCase();
}
export function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}
export function emailKey(e) {
  return "e:" + encodeURIComponent(normEmail(e));
}
export function getCookie(req, name) {
  const c = req.headers.get("cookie") || "";
  const m = c.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}
export function randomToken() {
  const a = new Uint8Array(32);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
// Comparación en tiempo constante para secretos
export function safeEqual(a, b) {
  a = String(a || ""); b = String(b || "");
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

// Da acceso a un correo
export async function grant(email, source, extra = {}) {
  const store = buyers();
  const key = emailKey(email);
  const prev = (await store.get(key, { type: "json" })) || {};
  await store.setJSON(key, {
    ...prev, email: normEmail(email), status: "active", source,
    updatedAt: new Date().toISOString(), ...extra,
  });
}
// Quita el acceso y cierra sus sesiones
export async function revoke(email, source, extra = {}) {
  const store = buyers();
  const key = emailKey(email);
  const prev = (await store.get(key, { type: "json" })) || { email: normEmail(email) };
  const ses = sessions();
  for (const t of prev.sessions || []) await ses.delete("s:" + t);
  await store.setJSON(key, {
    ...prev, status: "revoked", sessions: [], source,
    updatedAt: new Date().toISOString(), ...extra,
  });
}
