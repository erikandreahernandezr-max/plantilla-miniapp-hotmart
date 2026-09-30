// Prepara el sitio antes de publicar. Lo ejecuta Netlify automáticamente.
// 1) Toma tu app (app/index.html) y la guarda protegida dentro de las funciones.
// 2) Crea la página de acceso con el nombre de tu app.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const APP_FILE = "app/index.html";
if (!existsSync(APP_FILE)) {
  console.error("\n[ERROR] No encontré el archivo app/index.html.");
  console.error("Sube tu app a la carpeta 'app' de tu repositorio con el nombre exacto: index.html\n");
  process.exit(1);
}
const html = readFileSync(APP_FILE, "utf8");
if (html.trim().length < 20) {
  console.error("\n[ERROR] app/index.html está vacío.\n");
  process.exit(1);
}
writeFileSync("netlify/lib/app-html.mjs", "export default " + JSON.stringify(html) + ";\n");

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const appName = esc((process.env.APP_NAME || "Mi app").trim());
const support = (process.env.SUPPORT_EMAIL || "").trim();
const supportLine = support
  ? `¿Sigues sin poder entrar? Escribe a ${esc(support)} con el correo de tu compra.`
  : "¿Sigues sin poder entrar? Escribe al correo de soporte que aparece en tu compra de Hotmart.";

const gate = readFileSync("scripts/gate.template.html", "utf8")
  .replaceAll("{{APP_NAME}}", appName)
  .replaceAll("{{SUPPORT_LINE}}", supportLine);
writeFileSync("public/index.html", gate);

const missing = ["HOTMART_HOTTOK", "ADMIN_KEY"].filter((k) => !process.env[k]);
if (missing.length) {
  console.warn("\n[AVISO] Faltan estas variables en Netlify: " + missing.join(", "));
  console.warn("La app se publica, pero el Webhook o la administración no funcionarán hasta que las agregues.\n");
}
console.log(`[OK] App preparada (${html.length} caracteres). Nombre: ${appName}`);
