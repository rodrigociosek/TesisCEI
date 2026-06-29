# GUÍA 05 — PostgreSQL
## Estándar de construcción de la capa de datos, aplicado a este proyecto

---

## Qué es este documento y cómo se usa

Igual que las Guías 03 y 04, este documento se consulta cada vez que voy a tocar la capa de datos (una tabla nueva, una query, una transacción) dentro de la construcción de un RF. Está organizado en bloques temáticos con DoR/DoD, siguiendo la estructura qué-hacer / qué-NO-hacer / por-qué: varios de los errores más graves en esta capa no producen un error inmediato — producen datos inconsistentes o conexiones agotadas que solo se notan bajo carga real, mucho después de escrito el código.

**Importante sobre vigencia:** confío en el contenido de este documento tal como está escrito, sin volver a verificarlo contra la documentación oficial en cada uso.

## El estándar de referencia

La fuente de esta guía es la documentación oficial de node-postgres (`node-postgres.com`, en particular sus páginas de Pooling y Transactions), que es el driver oficial recomendado por la comunidad Node.js para conectar con PostgreSQL, y las convenciones DBML que ya gobiernan el MER de este proyecto (`mer_distribuidora.md`). Este proyecto NO usa un ORM: el propio MER está escrito en DBML puro sin referencia a ningún ORM, y dado el tamaño y las necesidades reales de este proyecto, escribir SQL directo con `pg` es la opción más simple y transparente (Guía 02).

---

## BLOQUE 1 — El pool de conexiones (no se repite aquí: ver Guía 03, Bloque 5)

La configuración del pool de conexiones de PostgreSQL vive documentada en la Guía 03 (Express), Bloque 5, porque es Express quien crea y posee ese pool. Si la pregunta es "¿cómo me conecto a la base desde el servidor?", ir a la Guía 03.

---

## BLOQUE 2 — Queries parametrizadas (no se repite aquí: ver Guía 03, Bloque 6)

La regla de seguridad sobre inyección SQL y el uso obligatorio de parámetros posicionales (`$1`, `$2`...) vive documentada en la Guía 03, Bloque 6, con su antipatrón completo. Esta guía la aplica sin repetirla.

---

## BLOQUE 3 — Nomenclatura: snake_case en SQL, camelCase en JavaScript

**Por qué importa:** el MER de este proyecto usa snake_case (convención estándar de PostgreSQL: `nombre_completo`, `fecha_creacion`), mientras que el diagrama de clases y el código JavaScript usan camelCase (`nombreCompleto`, `fechaCreacion`). Si esta traducción no se fija de forma consistente, el mismo campo termina escrito de formas distintas en archivos distintos del mismo proyecto.

**Qué hacer:** la traducción ocurre en el límite entre la query SQL y el objeto JavaScript que la recibe — nunca a mitad de camino.
```javascript
// El SQL usa snake_case porque así se llaman las columnas reales del MER
const resultado = await pool.query(
  'SELECT id, nombre_completo, fecha_creacion FROM usuario WHERE id = $1',
  [id]
);

// La traducción a camelCase ocurre al construir el objeto de salida
const fila = resultado.rows[0];
const usuario = {
  id: fila.id,
  nombreCompleto: fila.nombre_completo,
  fechaCreacion: fila.fecha_creacion,
};
```

**Qué NO hacer:**
```javascript
// ❌ Usar camelCase directamente en la query SQL, asumiendo que PostgreSQL lo acepta igual
const resultado = await pool.query(
  'SELECT id, nombreCompleto, fechaCreacion FROM usuario WHERE id = $1',
  [id]
);
```
**Por qué esto falla:** PostgreSQL convierte automáticamente los identificadores sin comillas a minúsculas. `nombreCompleto` sin comillas se interpreta como `nombrecompleto`, que no coincide con la columna real `nombre_completo` del MER — la query falla con un error de "columna no existe", o peor, si por coincidencia existiera una columna con ese nombre exacto en minúsculas, devolvería datos de un campo equivocado sin ningún error visible.

**Qué NO hacer — variante igualmente riesgosa:**
```javascript
// ❌ Devolver la fila cruda de PostgreSQL directamente al frontend, sin traducir
return resultado.rows[0]; // el frontend recibe nombre_completo, no nombreCompleto
```
**Por qué esto genera inconsistencia:** la Guía 04 (React) asume que los datos que llegan del backend ya están en camelCase. Si el backend no hace la traducción, cada componente de React que consume esos datos tendría que conocer la convención de nombres de la base de datos — mezclando una preocupación de la capa de datos dentro de la capa de presentación.

**DoD:**
- [ ] Cada nombre de columna usado en una query SQL coincide exactamente (carácter a carácter, en snake_case) con el nombre del MER (Guía 01, Sección 3).
- [ ] La traducción snake_case → camelCase ocurre en un solo lugar reconocible (al construir el objeto de retorno del servicio), no dispersa en varios archivos, y nunca se devuelve una fila cruda de PostgreSQL directamente hacia afuera del servicio.

---

## BLOQUE 4 — Transacciones (el antipatrón más crítico de esta guía)

**Por qué importa:** cuando una operación de negocio implica escribir en más de una tabla (por ejemplo, confirmar un pedido desde el carrito, que según el diagrama de clases genera varios `Pedido` y sus `PedidoItem` correspondientes — ver método `confirmarDesdeCarrito`), todas esas escrituras deben ocurrir como una sola unidad atómica: si una falla, ninguna debe quedar aplicada.

**El antipatrón más importante de toda esta guía, declarado explícitamente por la documentación oficial de node-postgres:** *"Do not use transactions with the `pool.query` method."* La razón es estructural, no una preferencia de estilo: cada llamada a `pool.query(...)` puede ser servida por una conexión física distinta del pool, elegida automáticamente según cuál esté libre en ese momento. PostgreSQL aísla una transacción a una única conexión — si el `BEGIN`, los `INSERT` y el `COMMIT` de una misma transacción terminan repartidos entre conexiones físicas distintas, **la transacción nunca existió como tal**, sin que PostgreSQL ni node-postgres lancen ningún error advirtiéndolo.

**Qué NO hacer:**
```javascript
// ❌ Cada pool.query() puede usar una conexión física distinta del pool.
// Esto NO es una transacción real, aunque el código "parezca" tener BEGIN/COMMIT.
export async function confirmarPedidoDesdeCarrito(datosCarrito) {
  await pool.query('BEGIN');
  const pedido = await pool.query(
    'INSERT INTO pedido (usuario_id, direccion_entrega, estado) VALUES ($1, $2, $3) RETURNING *',
    [datosCarrito.usuarioId, datosCarrito.direccionEntrega, 'pendiente']
  );
  for (const item of datosCarrito.items) {
    await pool.query(
      'INSERT INTO pedido_item (pedido_id, cantidad) VALUES ($1, $2)',
      [pedido.rows[0].id, item.cantidad]
    );
  }
  await pool.query('COMMIT');
  return pedido.rows[0];
}
```
**Por qué esto es peligroso incluso cuando "parece funcionar" en pruebas manuales:** con poca carga concurrente, el pool puede reutilizar la misma conexión física para todas estas llamadas seguidas, y el código se comporta como si la transacción fuera real. Bajo carga real, con múltiples requests simultáneos compitiendo por las conexiones del pool, alguna de estas llamadas puede recibir una conexión distinta — el `COMMIT` se ejecuta en una conexión donde nunca hubo un `BEGIN` correspondiente, o un `INSERT` queda aplicado fuera de la transacción mientras el resto se revierte. El resultado es corrupción de datos silenciosa: pedidos sin sus items, o items sin su pedido.

**Qué hacer — la forma correcta, usando un cliente dedicado de principio a fin:**
```javascript
export async function confirmarPedidoDesdeCarrito(datosCarrito) {
  const client = await pool.connect(); // se reserva UNA conexión física para toda la operación
  try {
    await client.query('BEGIN');

    const pedido = await client.query(
      'INSERT INTO pedido (usuario_id, direccion_entrega, estado) VALUES ($1, $2, $3) RETURNING *',
      [datosCarrito.usuarioId, datosCarrito.direccionEntrega, 'pendiente']
    );

    for (const item of datosCarrito.items) {
      await client.query(
        'INSERT INTO pedido_item (pedido_id, cantidad, precio_venta_congelado) VALUES ($1, $2, $3)',
        [pedido.rows[0].id, item.cantidad, item.precioEstimado]
      );
    }

    await client.query('COMMIT');
    return pedido.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release(); // siempre se libera el cliente, haya éxito o error
  }
}
```

**Qué NO hacer — olvidar liberar el cliente:**
```javascript
// ❌ Sin finally: si BEGIN, alguna query, o COMMIT lanzan una excepción inesperada
// antes de llegar al release(), esta conexión queda "perdida" para el resto de la app.
export async function confirmarPedidoDesdeCarrito(datosCarrito) {
  const client = await pool.connect();
  await client.query('BEGIN');
  const pedido = await client.query('INSERT INTO pedido ...', [/* ... */]);
  await client.query('COMMIT');
  client.release(); // si algo de arriba falla, esta línea nunca se ejecuta
  return pedido.rows[0];
}
```
**Por qué esto es grave incluso sin transacción explícita:** cada conexión no liberada reduce permanentemente el tamaño efectivo del pool (documentado como "connection leak" en los issues oficiales del proyecto node-postgres). Con el tiempo, el pool se agota por completo y la aplicación deja de poder atender nuevas peticiones a la base — un fallo que aparece horas o días después de desplegado el código, no inmediatamente.

**Qué NO hacer — rollback sin relanzar el error:**
```javascript
// ❌ El catch hace rollback pero no relanza el error: el controlador cree que la operación tuvo éxito
} catch (error) {
  await client.query('ROLLBACK');
  console.log('Algo falló'); // el error se traga aquí
} finally {
  client.release();
}
```
**Por qué esto es incorrecto:** si el error no se relanza (`throw error`), la función no le comunica al código que la llamó que la operación falló — el controlador puede terminar respondiendo `200 OK` al cliente cuando en realidad no se guardó nada.

**DoD:**
- [ ] Identifiqué, según el diagrama de clases (Guía 01, Sección 4), si el método de dominio que estoy implementando escribe en más de una tabla relacionada — si es así, uso una transacción.
- [ ] Toda transacción usa `pool.connect()` para obtener un cliente dedicado, y TODAS las queries de esa transacción (`BEGIN`, los `INSERT`/`UPDATE`/`DELETE`, y `COMMIT`/`ROLLBACK`) se ejecutan sobre ese mismo objeto `client` — nunca se mezcla con llamadas directas a `pool.query()` dentro de la misma operación.
- [ ] Toda transacción usa `client.release()` dentro de un bloque `finally`, sin excepción.
- [ ] Todo `catch` que hace `ROLLBACK` relanza el error (`throw error`) después, para que el llamador se entere de que la operación no se completó.

---

## BLOQUE 5 — Constraints como primera línea de defensa (no duplicar en JS lo que ya garantiza el esquema)

**Por qué importa:** esto conecta directamente con la Guía 01, Sección 2, y con el Árbol 3 de la Guía 02. Si una regla de negocio ya está garantizada por una constraint del MER (por ejemplo, `usuario.telefono UNIQUE`), el servidor no debe reimplementar esa misma verificación con una query `SELECT` previa como única defensa — eso crea una ventana de condición de carrera: dos requests simultáneos podrían pasar ambos la verificación `SELECT ... WHERE telefono = $1` (porque en ese instante ninguno de los dos insertó todavía) y luego ambos intentar el `INSERT`, violando la unicidad que se creía haber verificado.

**Qué NO hacer — depender solo de un SELECT previo:**
```javascript
// ❌ Esta verificación tiene una ventana de condición de carrera
const existente = await pool.query('SELECT id FROM usuario WHERE telefono = $1', [telefono]);
if (existente.rows.length > 0) {
  throw new Error('El teléfono ya está registrado.');
}
// si OTRO request inserta el mismo teléfono justo aquí, esta verificación ya no sirvió de nada
await pool.query('INSERT INTO usuario (telefono, ...) VALUES ($1, ...)', [telefono]);
```

**Qué hacer — capturar el error real de la constraint como la garantía definitiva:**
```javascript
try {
  const resultado = await pool.query(
    'INSERT INTO usuario (telefono, nombre_completo) VALUES ($1, $2) RETURNING *',
    [datos.telefono, datos.nombreCompleto]
  );
  return resultado.rows[0];
} catch (error) {
  if (error.code === '23505') { // código estándar de PostgreSQL para violación de UNIQUE
    const err = new Error('El número de teléfono ya está registrado. Iniciá sesión o recuperá tu contraseña.');
    err.status = 409;
    throw err;
  }
  throw error;
}
```
**Por qué esto es la forma correcta:** la constraint `UNIQUE` de PostgreSQL se evalúa de forma atómica en el motor de la base, sin la ventana de tiempo que un `SELECT` previo desde la aplicación necesariamente tiene. Un `SELECT` previo, si se quiere mantener para dar un mensaje de error más rápido en el caso común, puede coexistir con este manejo — pero la garantía real, la que evita la inconsistencia de datos, es siempre la captura del error de la constraint.

**DoD:**
- [ ] Para cada constraint del MER relevante a este RF (Guía 01, Sección 3), el código maneja el error que PostgreSQL lanza al violarla (por código de error, ej. `23505` para UNIQUE), en vez de depender solo de una verificación previa en JavaScript.
- [ ] El mensaje de error mostrado al usuario coincide con el que especifica el "Resultado esperado" del RF (Guía 01, Sección 1).

---

## BLOQUE 6 — Migraciones / cambios al esquema

**Qué hacer:** cualquier cambio a una tabla existente o tabla nueva debe reflejarse primero como una propuesta de cambio al MER en DBML (`mer_distribuidora.md`), siguiendo su misma convención (snake_case, `Note:` explicando el motivo de cada constraint no obvia), antes de escribir el `CREATE TABLE` o `ALTER TABLE` real.

**Qué NO hacer:** crear una tabla o columna nueva directamente en SQL, "porque hace falta ya", sin que exista primero su definición correspondiente en el MER del proyecto — esto es exactamente el vacío de diseño que la Guía 01 (Sección 3, DoD) y la Guía 02 (Árbol 4) ya identifican como condición de detención, no de avance silencioso.

**DoD:**
- [ ] Ninguna tabla o columna nueva se crea directamente en SQL sin que exista primero su definición correspondiente en el MER del proyecto.

---

## BLOQUE 7 — Tipos de datos: usar el tipo correcto de PostgreSQL para cada caso (bloque nuevo)

**Por qué importa:** un tipo de columna mal elegido no siempre produce un error inmediato — a veces produce pérdida silenciosa de precisión, que es mucho más difícil de detectar después.

**Qué NO hacer:**
```sql
-- ❌ Usar un tipo de punto flotante para dinero o cantidades exactas
ALTER TABLE precio_volumen ADD COLUMN precio_venta FLOAT;
```
**Por qué esto es un riesgo real:** los tipos de punto flotante (`FLOAT`, `REAL`, `DOUBLE PRECISION`) no representan exactamente la mayoría de los valores decimales — operaciones aritméticas repetidas sobre dinero pueden acumular errores de redondeo minúsculos pero reales. El propio MER de este proyecto ya usa `decimal` para campos como `precio_venta` y `cantidad` (ver `diagrama_codigo_completo.md`), que es la elección correcta para este caso.

**Qué hacer:** usar `NUMERIC`/`DECIMAL` de PostgreSQL para cualquier valor monetario o cantidad que necesite precisión exacta, tal como ya está definido en el MER de este proyecto — no introducir un tipo distinto al ya fijado ahí.

**DoD:**
- [ ] El tipo de columna usado en cualquier `CREATE TABLE`/`ALTER TABLE` nuevo coincide exactamente con el tipo ya fijado en el MER para ese campo (Guía 01, Sección 3) — no se sustituye por un tipo "equivalente" a criterio propio.
