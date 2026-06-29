# GUÍA 03 — Express.js
## Estándar de construcción del backend, aplicado a este proyecto

---

## Qué es este documento y cómo se usa

Este documento no se lee de una sola vez ni se "cierra" como las guías 00/01 — se consulta cada vez que voy a tocar una pieza de backend (una ruta, un controlador, un middleware, una conexión a datos) dentro de la construcción de un RF. Está organizado en **bloques temáticos**, cada uno con su propio DoR/DoD aplicable cada vez que ese tema aparece en el RF actual — no una sola vez por todo el proyecto.

Cada bloque sigue, cuando aplica, esta estructura: **qué hacer** (la forma correcta, con código), **qué NO hacer** (los antipatrones reales y documentados que llevan al mismo problema de forma silenciosa), y **por qué** (la razón técnica, no una preferencia de estilo). La razón de incluir explícitamente el "qué NO hacer" es que varios de los errores más comunes en Express no producen un error visible inmediato — producen un comportamiento que parece funcionar en desarrollo y falla bajo carga, en producción, o solo en el camino de error. Cubrir solo la forma correcta deja a una IA sin defensa contra escribir, con buena fe, exactamente el código que parece razonable pero esconde el problema.

**Importante sobre vigencia:** el contenido de este documento refleja el estándar actual de Express, OWASP y del ecosistema Node/PostgreSQL al momento de escribirlo. Cuando lo use, confío en lo que está escrito aquí tal como está, sin volver a verificarlo contra la documentación oficial en cada uso.

## El estándar de referencia

La fuente de esta guía es la documentación oficial de Express (`expressjs.com/en/advanced/best-practice-security`, `expressjs.com/en/guide/error-handling`), el OWASP Node.js Security Cheat Sheet, y la documentación oficial de node-postgres (`node-postgres.com`), más las convenciones de estructura de proyecto más extendidas en la comunidad Node/Express actual (patrón de capas: `routes` → `controllers` → `services`/`models` → `config`/`middlewares`).

---

## BLOQUE 1 — Estructura de carpetas

**Por qué importa:** Express, a diferencia de frameworks como Rails o Django, no impone una estructura — es deliberadamente "no opinado" (unopinionated), según su propia documentación. Esto significa que si no fijamos una estructura ANTES de empezar a codear el primer RF, cada RF nuevo corre el riesgo de inventar su propia organización, y el proyecto se vuelve inconsistente a medida que crece.

**Qué hacer:**
```
/src
  /config        → conexión a la base, variables de entorno
  /routes        → definición de endpoints, sin lógica de negocio
  /controllers   → orquestan: reciben el request, llaman al servicio, responden
  /services      → lógica de negocio real (lo que el diagrama de clases llama "métodos de dominio")
  /middlewares   → autenticación, manejo de errores, validación de entrada
  app.js         → configuración de Express (middlewares globales, montaje de rutas)
  server.js      → arranque del servidor (listen)
```

**Qué NO hacer:**
- No escribir queries SQL directamente dentro de un archivo de `/routes` o `/controllers` — esto mezcla tres responsabilidades distintas (HTTP, orquestación, acceso a datos) en un solo archivo, y hace que la lógica de negocio sea imposible de probar sin levantar el servidor HTTP completo.
- No crear una carpeta nueva por cada entidad pequeña "por organización" si el proyecto no la necesita todavía — esto es exactamente el tipo de complejidad anticipada que la Guía 02 (criterio de simplicidad) descarta. La estructura de 5 carpetas de arriba es el techo razonable para este proyecto, no el piso desde el que seguir creciendo por defecto.

**DoR (antes de tocar este bloque):** sé qué entidad de dominio (Guía 01, Sección 4) y qué tabla (Guía 01, Sección 3) está involucrada en el endpoint que voy a crear.

**DoD (para considerar este bloque cumplido en el RF actual):**
- [ ] La ruta nueva vive en `/routes`, sin lógica de negocio dentro del archivo de ruta.
- [ ] El controlador nuevo vive en `/controllers`, y es delgado: recibe el request, llama a una función de `/services`, devuelve la respuesta — no contiene queries SQL ni reglas de negocio escritas directamente.
- [ ] La lógica de negocio real vive en `/services`, usando los métodos y nombres exactos que la Guía 01 (Sección 4) extrajo del diagrama de clases.

---

## BLOQUE 2 — Rutas y controladores, y el manejo de errores asíncronos (el hueco más común de toda esta guía)

**Por qué importa:** el patrón "controlador delgado" (thin controller) evita que la lógica de negocio quede atrapada dentro del manejo de HTTP. Pero el riesgo más serio de este bloque no es de organización — es que **Express, en su versión 4 (la más extendida en proyectos actuales), no captura automáticamente los errores lanzados dentro de una función `async`**. Si un controlador `async` lanza un error (por ejemplo, porque `await pool.query(...)` falla) y ese error no está envuelto en un `try/catch` que llame a `next(error)`, la petición HTTP se queda colgada sin respuesta — el cliente espera indefinidamente, y el servidor no se entera de que algo salió mal salvo que se rastree manualmente.

**Qué hacer — forma estándar de una ruta:**
```javascript
// routes/productos.routes.js
import { Router } from 'express';
import * as productosController from '../controllers/productos.controller.js';

const router = Router();

router.post('/productos', productosController.crearProducto);
router.get('/productos', productosController.listarCatalogo);

export default router;
```

**Qué hacer — forma estándar de un controlador, con manejo explícito del error asíncrono:**
```javascript
// controllers/productos.controller.js
import * as productosService from '../services/productos.service.js';

export async function crearProducto(req, res, next) {
  try {
    const producto = await productosService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    next(error); // delega al middleware de manejo de errores (Bloque 4)
  }
}
```

**Qué NO hacer — el antipatrón silencioso:**
```javascript
// ❌ Esto se ve igual de "correcto" a simple vista, pero es un error grave:
export async function crearProducto(req, res) {
  // sin try/catch: si productosService.crearProducto lanza un error,
  // Express 4 NO lo captura. La petición se queda sin responder.
  const producto = await productosService.crearProducto(req.body);
  res.status(201).json(producto);
}
```
**Por qué falla en silencio:** en desarrollo, con pocos datos y poca carga, este código puede "funcionar" la mayoría de las veces porque rara vez se dispara el camino de error. El problema aparece en producción, cuando una constraint de PostgreSQL rechaza un INSERT (Guía 05, Bloque 5) o la base no responde — ahí la petición se cuelga, el cliente no recibe ningún mensaje, y no hay registro del error en los logs porque nunca llegó al middleware de errores.

**Qué NO hacer — alternativa igualmente riesgosa:**
```javascript
// ❌ Manejar el error con un res.status(500) escrito a mano en cada controlador
export async function crearProducto(req, res) {
  try {
    const producto = await productosService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' }); // duplica al Bloque 4, sin sus reglas
  }
}
```
**Por qué esto también es incorrecto:** reimplementa el manejo de errores en cada controlador en vez de centralizarlo (violación de DRY, Guía 02), y normalmente termina exponiendo mensajes inconsistentes o, peor, detalles internos del error (stack traces, mensajes de PostgreSQL) que no deberían llegar al cliente — ver Bloque 7.

**DoD:**
- [ ] Cada función de controlador `async` está envuelta en `try/catch`, y el `catch` siempre llama a `next(error)` — nunca responde el error directamente con su propio `res.status`.
- [ ] El nombre del endpoint y del recurso en la URL coincide con el nombre de la entidad tal como aparece en el MER/diagrama de clases (Guía 01) — no una variación libre.

---

## BLOQUE 3 — Validación de entrada

**Por qué importa:** según la documentación oficial de Express ("Do not trust user input") y el OWASP Node.js Security Cheat Sheet, nunca se debe confiar en los datos que llegan en `req.body`, `req.query` o `req.params` sin verificarlos antes de pasarlos a la base de datos o usarlos en cualquier operación sensible (redirecciones, comandos de shell, rutas de archivo).

**Qué hacer:** la validación de "forma" de los datos (¿llegó el campo?, ¿es del tipo correcto?) se hace en el controlador o en un middleware de validación, ANTES de llamar al servicio. La validación de "regla de negocio" (¿este teléfono ya existe?) vive en el servicio, porque necesita consultar la base.

```javascript
// ✅ Validar antes de pasar al servicio
export async function registrarUsuario(req, res, next) {
  const { telefono, contrasena, consentimientoDatosOtorgado } = req.body;
  if (!telefono || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  if (!consentimientoDatosOtorgado) {
    return res.status(400).json({ error: 'Debés aceptar el tratamiento de datos personales para continuar.' });
  }
  try {
    const usuario = await usuariosService.registrar(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}
```

**Qué NO hacer:**
```javascript
// ❌ Confiar en que el frontend ya validó, y pasar req.body directo al servicio sin chequeo alguno
export async function registrarUsuario(req, res, next) {
  try {
    const usuario = await usuariosService.registrar(req.body); // si falta un campo, esto falla
    res.status(201).json(usuario);                              // más abajo, con un error confuso
  } catch (error) {
    next(error);
  }
}
```
**Por qué esto falla:** el frontend (React) puede tener su propia validación (Guía 04, Bloque 4), pero un cliente HTTP no tiene por qué ser ese frontend — puede ser una petición manual, un script, o un ataque. La validación del lado del servidor es la única que realmente protege la integridad de los datos; la del cliente es solo para dar feedback rápido al usuario legítimo.

- No usar `res.redirect` con una URL tomada directamente de la entrada del usuario sin validarla — esto se llama *open redirect* y la documentación oficial de Express lo señala explícitamente como vector de phishing. Si este proyecto en algún momento redirige según un parámetro de la URL, ese valor debe validarse contra una lista de destinos permitidos antes de redirigir.

**DoD:**
- [ ] Verifiqué, usando la Sección 2 de la Guía 01, cuáles validaciones de este RF son responsabilidad del servidor (no de una constraint de PostgreSQL) — esas son las que implemento aquí.
- [ ] Los mensajes de error de validación coinciden textualmente con los que especifica el RF en su "Resultado esperado" (Guía 01, Sección 1) — no son mensajes genéricos inventados.
- [ ] Ninguna entrada del usuario se usa en un redirect, una ruta de archivo, o un comando de shell sin validarla primero contra un conjunto de valores permitidos.

---

## BLOQUE 4 — Manejo de errores centralizado

**Por qué importa:** un middleware de errores único evita repetir la misma lógica de "qué responder cuándo algo falla" en cada controlador (DRY). La documentación oficial de Express es explícita en un detalle técnico que suele pasarse por alto: Express reconoce un middleware como manejador de errores únicamente por tener **cuatro parámetros** `(err, req, res, next)` — si se omite alguno, Express lo trata como middleware normal y nunca lo invoca para errores.

**Qué hacer — forma estándar:**
```javascript
// middlewares/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  const mensaje = err.mensaje || 'Ocurrió un error inesperado.';
  res.status(status).json({ error: mensaje });
}

// app.js (al final, después de montar todas las rutas)
app.use(errorHandler);
```

**Qué NO hacer:**
```javascript
// ❌ Middleware de errores con solo 3 parámetros: Express NUNCA lo reconocerá como error handler
export function errorHandler(err, req, res) {
  res.status(500).json({ error: err.message });
}
```
**Por qué esto falla en silencio:** el código se ve idéntico a simple vista, compila sin error, y aun así Express lo ignora por completo para el flujo de errores — los errores caerán en el manejador por defecto de Express (que devuelve HTML con detalles internos, ver Bloque 7), no en el que se acaba de escribir.

```javascript
// ❌ Montar el error handler ANTES de las rutas
app.use(errorHandler);
app.use('/api/productos', productosRoutes);
```
**Por qué esto falla:** Express ejecuta los middlewares en el orden en que se montan. Un error handler montado antes de las rutas nunca recibe los errores que esas rutas generan más adelante en la cadena.

**DoD:**
- [ ] Existe un único middleware de errores con exactamente 4 parámetros `(err, req, res, next)`, montado al final de `app.js`, después de todas las rutas.
- [ ] Ningún controlador individual reimplementa su propio manejo de errores genérico.

---

## BLOQUE 5 — Conexión a PostgreSQL desde Express

**Por qué importa:** la documentación oficial de node-postgres es explícita: nunca se abre una conexión nueva por cada request — eso agota el límite de conexiones del servidor de PostgreSQL bajo carga (`max_connections`, por defecto 100 en PostgreSQL). Se usa un *pool* de conexiones, creado una sola vez al iniciar la aplicación, y nunca destruido ni recreado durante la vida del proceso.

**Qué hacer — forma estándar:**
```javascript
// config/db.js
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // máximo de conexiones simultáneas en el pool
});

pool.on('error', (err) => {
  console.error('Error inesperado en una conexión inactiva del pool', err);
});
```

```javascript
// services/productos.service.js
import { pool } from '../config/db.js';

export async function crearProducto(datos) {
  const resultado = await pool.query(
    'INSERT INTO producto (nombre, tipo_producto) VALUES ($1, $2) RETURNING *',
    [datos.nombre, datos.tipoProducto]
  );
  return resultado.rows[0];
}
```

**Qué NO hacer:**
```javascript
// ❌ Crear un Pool nuevo dentro de un controlador o servicio, en cada request
export async function crearProducto(datos) {
  const pool = new Pool({ /* ...config... */ }); // ¡un Pool nuevo en cada llamada!
  const resultado = await pool.query('INSERT INTO producto ...', [datos.nombre]);
  return resultado.rows[0];
}
```
**Por qué esto falla:** cada `new Pool()` abre su propio grupo de conexiones físicas a PostgreSQL. Bajo carga moderada, esto agota rápidamente el `max_connections` del servidor — exactamente el problema que el pool existe para prevenir, multiplicado por la cantidad de requests simultáneos.

**DoD:**
- [ ] Existe un único `Pool` creado en `config/db.js`, importado donde se necesite — nunca se crea un `Pool` nuevo dentro de un controlador o servicio.
- [ ] Toda query usa parámetros posicionales (`$1`, `$2`...) — ver Bloque 6 para el detalle de por qué esto no es negociable.
- [ ] Los nombres de columna en la query SQL coinciden exactamente con los del MER (snake_case), y la traducción a camelCase ocurre al recibir/devolver el objeto en JavaScript, según lo fijado en la Guía 01, Sección 3.

---

## BLOQUE 6 — Prevención de inyección SQL (regla no negociable)

**Por qué importa:** este bloque se separa del Bloque 5 para darle el peso que merece. Tanto la documentación oficial de Express como el OWASP Node.js Security Cheat Sheet señalan la inyección SQL como una de las vulnerabilidades de más alto impacto, y la defensa estándar de la industria es el uso exclusivo de queries parametrizadas o prepared statements.

**Qué hacer:**
```javascript
// ✅ Parámetros posicionales: PostgreSQL trata el valor como dato, nunca como código SQL
const resultado = await pool.query(
  'SELECT * FROM usuario WHERE telefono = $1',
  [telefono]
);
```

**Qué NO hacer — el antipatrón clásico:**
```javascript
// ❌ Concatenación directa de un valor que viene del usuario
const query = `SELECT * FROM usuario WHERE telefono = '${telefono}'`;
const resultado = await pool.query(query);
```
**Por qué esto es una vulnerabilidad real, no solo "mala práctica":** si `telefono` llega con el valor `' OR '1'='1`, la query ejecutada termina siendo `SELECT * FROM usuario WHERE telefono = '' OR '1'='1'`, que devuelve TODAS las filas de la tabla en vez de ninguna. Con una entrada más elaborada, el mismo patrón permite borrar tablas o extraer datos de otras filas. Esto no depende de que el atacante sea sofisticado — herramientas automatizadas como `sqlmap` (mencionada en la propia documentación oficial de Express) prueban este patrón de forma sistemática contra cualquier endpoint expuesto.

**Qué NO hacer — variante menos obvia del mismo error:**
```javascript
// ❌ "Sanitizar" a mano con reemplazos de comillas, en vez de usar parámetros
const telefonoSeguro = telefono.replace(/'/g, "''");
const query = `SELECT * FROM usuario WHERE telefono = '${telefonoSeguro}'`;
```
**Por qué esto sigue siendo incorrecto:** escapar comillas a mano es una solución incompleta y frágil — distintos contextos (dentro de un `LIKE`, dentro de un array, con codificaciones distintas) tienen distintas formas de evadir un escape manual. La solución correcta no es "escapar mejor", es no concatenar nunca: usar siempre el mecanismo de parámetros que node-postgres ya provee.

**DoD:**
- [ ] Ninguna query de este RF concatena datos de entrada del usuario directamente dentro del string SQL, bajo ninguna forma (ni directa, ni con escape manual).
- [ ] Todos los valores variables se pasan como array en el segundo argumento de `pool.query` o `client.query`.

---

## BLOQUE 7 — Qué información NO debe salir en una respuesta de error

**Por qué importa (bloque nuevo, no existía en la versión anterior de esta guía):** tanto el OWASP Cheat Sheet como la documentación oficial de Express coinciden en este punto: un mensaje de error que revela detalles internos (stack trace, nombre de la tabla, versión de la librería, mensaje crudo de PostgreSQL) le da a un atacante información valiosa para afinar un ataque posterior, además de ser una mala experiencia para el usuario legítimo.

**Qué hacer:**
```javascript
// El error handler (Bloque 4) registra el detalle completo en el log del servidor,
// pero solo envía al cliente un mensaje de negocio controlado.
export function errorHandler(err, req, res, next) {
  console.error(err.stack); // detalle completo, solo en el log del servidor
  const status = err.status || 500;
  const mensaje = err.status ? err.mensaje : 'Ocurrió un error inesperado.'; // genérico si no es un error esperado
  res.status(status).json({ error: mensaje });
}
```

**Qué NO hacer:**
```javascript
// ❌ Devolver el mensaje crudo del error de PostgreSQL o el stack trace al cliente
res.status(500).json({ error: err.message, stack: err.stack });
```
**Por qué esto es un riesgo:** un mensaje de PostgreSQL puede revelar el nombre exacto de una tabla o columna, lo cual ayuda a un atacante a refinar un intento de inyección SQL; un stack trace puede revelar rutas de archivos del servidor o versiones de librerías con vulnerabilidades conocidas.

**DoD:**
- [ ] Ningún error no controlado (sin un `status` explícito asignado por el código del proyecto) devuelve su mensaje original al cliente — se reemplaza por un mensaje genérico.
- [ ] El detalle completo del error (incluyendo `stack`) se registra en el log del servidor, no en la respuesta HTTP.

---

## BLOQUE 8 — Cabeceras HTTP de seguridad (Helmet)

**Por qué importa (bloque nuevo):** Express, por defecto, no establece varias cabeceras HTTP que mitigan ataques conocidos (XSS, clickjacking, MIME sniffing). La documentación oficial de Express recomienda explícitamente el middleware `helmet` para esto, en vez de configurar cada cabecera a mano.

**Qué hacer:**
```javascript
// app.js
import helmet from 'helmet';
app.use(helmet());
app.disable('x-powered-by'); // reduce la "huella" de que el servidor corre Express
```

**Qué NO hacer:**
- No dejar la configuración de cabeceras de seguridad para "más adelante, cuando el proyecto esté en producción" — agregar `helmet()` es una sola línea sin costo de complejidad real (no viola el criterio de simplicidad de la Guía 02, porque no es una capa de abstracción nueva, es una línea de configuración estándar), así que no hay razón para postergarla.

**DoD:**
- [ ] `helmet()` está montado como middleware global en `app.js`, antes de las rutas.
- [ ] La cabecera `X-Powered-By` está deshabilitada.

---

## BLOQUE 9 — Variables de entorno y configuración

**Qué hacer:** ninguna credencial (usuario, contraseña, connection string) vive escrita directamente en el código. Todo pasa por variables de entorno (`process.env`), cargadas típicamente con un archivo `.env` en desarrollo (nunca subido al control de versiones).

**Qué NO hacer:**
```javascript
// ❌ Credenciales escritas directamente en el código
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'admin123', // si este archivo llega a un repositorio público, la base queda expuesta
});
```

**DoD:**
- [ ] No hay credenciales ni datos sensibles escritos literalmente en ningún archivo `.js`.
- [ ] El archivo `.env` está listado en `.gitignore`.

---

## BLOQUE 10 — Rate limiting en endpoints de autenticación (bloque nuevo)

**Por qué importa:** este proyecto tiene RF de login y recuperación de contraseña (RF-010, RF-011, RF-054) que, sin protección, son vulnerables a ataques de fuerza bruta — probar muchas combinaciones de contraseña automáticamente. La documentación oficial de Express recomienda explícitamente limitar los intentos de autenticación por IP y por usuario.

**Qué hacer:**
```javascript
// middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por IP en esa ventana
  message: { error: 'Demasiados intentos. Intentá de nuevo más tarde.' },
});

// routes/auth.routes.js
router.post('/login', loginLimiter, authController.iniciarSesion);
```

**Qué NO hacer:**
- No dejar un endpoint de login o recuperación de contraseña sin ningún límite de intentos — esto no es una optimización futura, es una de las protecciones básicas que la propia documentación oficial de Express enumera para producción.

**DoD:**
- [ ] Si el RF actual es de autenticación (login, recuperación de contraseña), tiene un middleware de límite de intentos aplicado a su ruta.
