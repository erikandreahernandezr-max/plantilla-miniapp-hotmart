import { buyers, grant, revoke, emailKey, normEmail, validEmail, safeEqual, json } from "../lib/lib.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false }, 405);
  const key = Netlify.env.get("ADMIN_KEY");
  if (!key || key.length < 12) return json({ ok: false, error: "La clave de administración no está configurada o es muy corta (mínimo 12 caracteres). Revísala en Netlify." }, 503);
  if (!safeEqual(req.headers.get("x-admin-key"), key)) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos a ciegas
    return json({ ok: false, error: "Clave incorrecta." }, 401);
  }
  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "Solicitud inválida." }, 400); }
  const email = normEmail(body.email);
  if (!validEmail(email)) return json({ ok: false, error: "Correo inválido." }, 400);

  if (body.action === "grant") { await grant(email, "manual"); return json({ ok: true, msg: "Acceso dado a " + email }); }
  if (body.action === "revoke") { await revoke(email, "manual"); return json({ ok: true, msg: "Acceso quitado a " + email }); }
  const rec = await buyers().get(emailKey(email), { type: "json" });
  return json({ ok: true, msg: rec
    ? `${email}: ${rec.status === "active" ? "ACTIVO" : "SIN ACCESO"} · origen ${rec.source} · dispositivos ${(rec.sessions || []).length}`
    : `${email}: no está registrado` });
};

export const config = { path: "/api/admin" };
