import { buyers, sessions, emailKey, getCookie, json, COOKIE } from "../lib/lib.mjs";

export default async (req) => {
  const token = getCookie(req, COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return json({ ok: false });
  const s = await sessions().get("s:" + token, { type: "json" });
  if (!s) return json({ ok: false });
  const rec = await buyers().get(emailKey(s.email), { type: "json" });
  return json({ ok: !!rec && rec.status === "active" });
};

export const config = { path: "/api/me" };
