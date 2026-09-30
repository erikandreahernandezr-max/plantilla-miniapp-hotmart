import APP_HTML from "../lib/app-html.mjs";
import { buyers, sessions, emailKey, getCookie, COOKIE } from "../lib/lib.mjs";

const toGate = (msg) => new Response(null, {
  status: 302,
  headers: {
    location: "/" + (msg ? "?m=" + msg : ""),
    "cache-control": "no-store",
    "set-cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  },
});

export default async (req) => {
  const token = getCookie(req, COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return toGate();

  const s = await sessions().get("s:" + token, { type: "json" });
  if (!s) return toGate("sesion");

  const rec = await buyers().get(emailKey(s.email), { type: "json" });
  if (!rec || rec.status !== "active") return toGate("inactivo");

  return new Response(APP_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
};

export const config = { path: "/app" };
