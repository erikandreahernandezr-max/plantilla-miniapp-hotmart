import { grant, revoke, events, normEmail, validEmail, safeEqual, json } from "../lib/lib.mjs";

const DAR_ACCESO = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const QUITAR_ACCESO = new Set(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_CANCELED", "PURCHASE_PROTEST"]);

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "json" }, 400); }

  // Hotmart v2 envía el token en la cabecera X-HOTMART-HOTTOK
  const hottok = req.headers.get("x-hotmart-hottok") || body.hottok;
  if (!safeEqual(hottok, Netlify.env.get("HOTMART_HOTTOK"))) return json({ ok: false }, 401);

  const event = String(body.event || "");
  const data = body.data || {};
  const email = normEmail(data.buyer?.email);
  const productId = String(data.product?.id ?? "");
  const tx = String(data.purchase?.transaction ?? "");

  // Si se configuró el ID del producto, ignora ventas de otros productos
  const soloProducto = Netlify.env.get("HOTMART_PRODUCT_ID");
  if (soloProducto && productId && productId !== String(soloProducto)) {
    return json({ ok: true, ignored: "otro producto" });
  }

  let accion = "ninguna";
  if (validEmail(email)) {
    if (DAR_ACCESO.has(event)) { await grant(email, "hotmart", { transaction: tx, productId }); accion = "acceso"; }
    else if (QUITAR_ACCESO.has(event)) { await revoke(email, "hotmart:" + event, { transaction: tx }); accion = "revocado"; }
  }

  // Registro simple para auditoría
  const id = new Date().toISOString() + "_" + (body.id || tx || Math.random().toString(36).slice(2));
  await events().setJSON(id, { event, email, productId, tx, accion });

  return json({ ok: true, accion });
};

export const config = { path: "/api/hotmart" };
