# Plantilla: Miniapp protegida para Hotmart (Nivel 2)

Esta plantilla publica tu miniapp en Netlify con un **portero**: solo entran las personas que compraron en Hotmart, usando el **mismo correo de su compra**. Si alguien pide reembolso, pierde el acceso automáticamente.

> Material educativo entregado tal cual, sin soporte técnico personalizado. Úsalo bajo tu responsabilidad y pruébalo antes de vender.

## Qué necesitas antes de empezar

- Tu app en un solo archivo HTML (si tiene imágenes, que estén dentro del mismo archivo).
- Cuenta en **GitHub** (gratis).
- Cuenta en **Netlify** (gratis), con la verificación en dos pasos activada.
- Tu producto creado en **Hotmart** como "Curso Online".

## Paso 1 · Crea tu copia con un clic

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/erikandreahernandezr-max/plantilla-miniapp-hotmart)

1. Haz clic en el botón. Netlify te pedirá conectar tu GitHub: acepta.
2. Netlify crea **una copia de esta plantilla en tu GitHub** y **un proyecto en tu Netlify**.
3. Llena el formulario:

| Campo | Qué poner | Dónde lo encuentras |
| --- | --- | --- |
| APP_NAME | El nombre de tu app | Tú lo decides |
| HOTMART_HOTTOK | El Hottok | Hotmart → Herramientas → Webhook → Autentificación |
| HOTMART_PRODUCT_ID | El ID de tu producto (solo números) | En la página de tu producto en Hotmart |
| ADMIN_KEY | Una clave larga que inventas (mínimo 12 caracteres) | Guárdala en un lugar seguro |
| SUPPORT_EMAIL | Tu correo de soporte (opcional) | — |

4. Publica. Al terminar, Netlify te muestra la dirección de tu app, algo como `tu-proyecto.netlify.app`.
5. **Muy importante:** abre esa dirección en una ventana de incógnito. Si te pide iniciar sesión en Netlify, quienes compren tampoco podrán entrar. Apágalo: en Netlify → tu proyecto → Configuración del proyecto → General → **Acceso de visitantes** (Visitor access) → deja la protección en **ninguna / pública** y guarda.

Si GitHub te muestra "Autorizar Netlify" pidiendo acceso a repositorios públicos y privados, es normal: es el permiso oficial que Netlify necesita para crear tu copia.

**Cuida tus créditos:** el plan gratis de Netlify trae créditos mensuales y cada publicación gasta. Si se agotan, Netlify pausa **todos** tus proyectos. Usa el botón una sola vez y borra los proyectos de prueba.

**Nunca** pegues el Hottok ni la clave de administración en un chat, un documento compartido o una captura de pantalla.

## Paso 2 · Pon tu app

1. Entra a tu GitHub y abre el repositorio que se creó.
2. Abre la carpeta **app**.
3. Sube tu archivo con el nombre exacto **index.html**. Si ya existe, reemplázalo ("Add file" → "Upload files", o abre el archivo y usa el lápiz para editarlo).
4. Confirma el cambio ("Commit changes").
5. Espera 1 o 2 minutos: Netlify publica solo la versión nueva.

## Paso 3 · Conecta Hotmart (Webhook)

1. Hotmart → Herramientas → Webhook → Registrar Webhook.
2. **URL:** `https://tu-proyecto.netlify.app/api/hotmart` (cambia `tu-proyecto` por el tuyo).
3. **Versión:** 2.0.0.
4. **Producto:** el tuyo.
5. **Eventos:** Compra aprobada, Compra completa, Compra reembolsada, Chargeback, Compra cancelada.
6. Guarda y usa "Enviar prueba". En "Historial" debe aparecer **200** en cada evento.

## Paso 4 · Entrega el enlace en Hotmart

En el área de miembros de tu producto, crea una lección con este texto, y en la primera línea:

> **Importante: entra con el mismo correo que usaste para pagar en Hotmart. Con otro correo no funcionará.**
> Entra aquí: https://tu-proyecto.netlify.app

## Paso 5 · Prueba sin comprar

1. Abre tu dirección en una ventana de incógnito: debe pedir el correo.
2. Entra a `https://tu-proyecto.netlify.app/admin.html`, escribe tu clave de administración, tu correo y "Dar acceso".
3. Vuelve a la dirección, escribe tu correo: tu app debe abrirse.

## Paso 6 · Cambia el enlace de tu lección

Si ya vendías con el Nivel 1, tu dirección ahora es **nueva**: cámbiala en la lección de tu área de miembros en Hotmart.

## Página de administración

`https://tu-proyecto.netlify.app/admin.html` te permite:
- **Consultar estado** de un correo (ACTIVO o sin acceso).
- **Dar acceso** a mano (por ejemplo, si alguien compró con otro correo).
- **Quitar acceso** a mano.

## Si algo falla

| Síntoma | Qué revisar |
| --- | --- |
| La publicación falla con "No encontré el archivo app/index.html" | El archivo debe estar en la carpeta `app` y llamarse exactamente `index.html` |
| El Historial de Hotmart muestra 401 | El Hottok en Netlify no coincide con el de Hotmart |
| El Historial muestra 404 | La URL del Webhook está mal escrita (debe terminar en `/api/hotmart`) |
| "Clave incorrecta" en administración | Revisa ADMIN_KEY en Netlify → configuración del proyecto → variables de entorno. Después de cambiarla, vuelve a publicar |
| Al abrir la app pide iniciar sesión en Netlify | La protección de acceso de visitantes está activa. Apágala (ver Paso 1, punto 5) |
| Quien compró no puede entrar | Consulta su correo en administración. Casi siempre compró con otro correo |
| Cambiaste una variable y no hace efecto | Vuelve a publicar el proyecto en Netlify (Deploys → volver a publicar) |

Si tu pantalla no se ve como esta guía, no elijas al azar: identifica tu objetivo, busca la opción equivalente y, si usas IA, envíale una captura y pídele que trabaje solo con lo que ves.

## Cómo funciona

1. Alguien compra en Hotmart.
2. Hotmart avisa a tu app (Webhook), firmado con tu Hottok.
3. Tu app anota ese correo en su lista.
4. Quien compró entra con ese correo. Funciona en máximo 2 dispositivos: un tercero cierra la sesión más antigua.
5. Si hay reembolso, cancelación o chargeback, Hotmart avisa y tu app quita el acceso.

Límites: si alguien comparte su enlace y su correo, otra persona podría entrar (limitado a 2 dispositivos). Los datos que tu app guarde en el navegador no pasan de un dispositivo a otro.
