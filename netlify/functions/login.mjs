import { buyers, sessions, emailKey, normEmail, validEmail, randomToken, json, MAX_DISPOSITIVOS, COOKIE } from "../lib/lib.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "Solicitud inválida." }, 400); }
  const email = normEmail(body.email);
  if (!validEmail(email)) return json({ ok: false, error: "Escribe un correo válido." }, 400);

  const store = buyers();
  const rec = await store.get(emailKey(email), { type: "json" });
  if (!rec || rec.status !== "active") {
    return json({ ok: false, error: "Este correo no tiene una compra activa. Revisa que sea exactamente el mismo que usaste al pagar en Hotmart (búscalo en el mensaje de confirmación de compra)." }, 403);
  }

  // Límite de dispositivos: si ya hay 2, se cierra la sesión más antigua
  const token = randomToken();
  const list = [...(rec.sessions || []), token];
  const ses = sessions();
  while (list.length > MAX_DISPOSITIVOS) {
    const old = list.shift();
    await ses.delete("s:" + old);
  }
  await ses.setJSON("s:" + token, { email, createdAt: new Date().toISOString() });
  await store.setJSON(emailKey(email), { ...rec, sessions: list, lastLogin: new Date().toISOString() });

  const maxAge = 60 * 60 * 24 * 365;
  return json({ ok: true, redirect: "/app" }, 200, {
    "set-cookie": `${COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
  });
};

export const config = { path: "/api/login" };
