# Guía estándar para decidir qué lógica vive en la base de datos y qué lógica vive en la capa de programación

## Cómo usar este documento

Este documento es una guía de comportamiento para una IA que va a **diseñar o implementar** un sistema que ya tiene un MER definido (o está en proceso de tenerlo) y una lista de requerimientos funcionales, y que necesita producir, a partir de esos dos documentos, una clasificación completa de qué comportamiento vive en la base de datos (constraint, trigger, procedimiento almacenado, política de seguridad de fila) y qué comportamiento vive en la capa de programación (código de backend, servicio, validación de formulario). El documento cubre dos fases: primero **cómo extraer** la lista completa de reglas candidatas a partir del MER y los RF sin saltarse ninguna, y después **cómo clasificar** cada una de esas reglas en su capa correcta.

No es una guía de modelado de datos (esa es la guía de construir el MER) ni una guía de prueba de un esquema ya construido (esa es la guía de probar el MER). Esta guía asume que el esquema ya existe o está definido, y que la pregunta pendiente es **dónde ejecutar el comportamiento que opera sobre esos datos**.

Las fuentes de este documento son:
- La serie *"Where Does Business Logic Live?"* (SQL Server Science, 2026), un análisis balanceado de seis partes escrito desde la perspectiva de una DBA, con referencias verificadas a la arquitectura pública de Stack Overflow, GitHub, Shopify, Stripe y Uber — usado aquí principalmente por su **framework de seis preguntas** para decidir la ubicación de cualquier regla concreta.
- La documentación oficial de **Oracle Database** sobre integridad de datos (*Maintaining Data Integrity Through Constraints*), que establece el criterio formal de cuándo un constraint es suficiente y cuándo hace falta un trigger.
- La documentación oficial de **PostgreSQL** sobre constraints y row-level security, que establece una limitación técnica dura: un CHECK constraint no puede evaluar datos de otras filas ni de otras tablas.
- *Patterns of Enterprise Application Architecture* (Martin Fowler, 2003), específicamente los patrones Transaction Script, Domain Model y el antipatrón Anemic Domain Model, usado aquí para el criterio de cuándo la lógica de aplicación necesita un modelo de dominio real y cuándo un script simple es suficiente.
- Documentación de buenas prácticas sobre triggers (Red Gate / Simple Talk, SQLShack, Domo) usada para la lista de "qué NO hacer" con triggers.

Cuando el documento dice "no hagas esto", es una restricción dura. Cuando dice "pauta" o "tiende a", es una recomendación de calidad que mejora la decisión pero cuya ausencia no la invalida automáticamente — el framework de seis preguntas existe precisamente para los casos donde la pauta general no alcanza.

---

## Por qué esta es una decisión distinta de modelar o de probar un MER

Un MER responde "¿qué datos existen y cómo se relacionan?". Una prueba de MER responde "¿el esquema sostiene cada operación que un requerimiento describe?". Ninguna de las dos responde la pregunta que importa una vez que el esquema ya está validado: **¿quién ejecuta el comportamiento, y en qué momento?**

Esa pregunta tiene peso real porque la misma regla de negocio, puesta en el lugar equivocado, produce fallas estructuralmente distintas:

- Si una regla de **integridad** (algo que debe ser siempre verdad, sin excepción) se pone solo en la aplicación, cualquier proceso que escriba en la base sin pasar por esa aplicación —un script de migración, una corrección manual de un DBA a las 3 AM, una segunda aplicación que se conecta a la misma base más adelante— puede violarla sin que nada lo impida. La regla deja de ser una propiedad del dato y se vuelve una propiedad de un solo programa.
- Si una regla de **orquestación** (coordinar varios pasos, posiblemente llamando a sistemas externos, posiblemente esperando minutos u horas) se pone en un trigger de base de datos, la base queda haciendo llamadas salientes y manteniendo transacciones abiertas mientras espera una respuesta externa — el motor de base de datos no fue diseñado para eso, y un fallo en el sistema externo puede bloquear la transacción completa.
- Si una operación que afecta **muchas filas a la vez** (recalcular el saldo de todas las cuentas, expirar todas las sesiones vencidas) se implementa cargando cada fila a la aplicación, modificándola en memoria y guardándola de vuelta una por una, el resultado son miles de viajes de ida y vuelta a la base donde una sola instrucción `UPDATE` habría bastado.

Por eso esta guía no da una regla única ("todo va en la base" o "todo va en la aplicación") — esa idea es, en sí misma, la primera cosa que la guía pide rechazar. Da un **procedimiento de clasificación** que se aplica regla por regla, no a la "lógica de negocio" como bloque.

---

## Conceptos previos que hay que tener claros antes de clasificar una regla

**Integridad de datos (data integrity)**: una condición que debe ser verdadera para *toda fila, sin importar quién o qué la escribió* — una cantidad no puede ser negativa, una columna no puede estar vacía, una referencia debe apuntar a una fila que existe. Es la categoría con el criterio más claro y menos disputado de las cinco.

**Validación (validation)**: comprobar que un dato puntual de entrada es aceptable antes de actuar sobre él — "este código de descuento sigue vigente", "esta fecha no es anterior a hoy". A diferencia de la integridad, la validación suele necesitar repetirse en más de una capa a propósito (esto se explica más abajo, no es redundancia desperdiciada).

**Regla de negocio (business rule)**: una decisión del dominio que codifica cómo se comporta el negocio — "los clientes de nivel oro tienen envío gratis sobre cierto monto", "una factura superior a determinado valor requiere aprobación de un gerente". Cambia con el negocio, no con la estructura de los datos.

**Orquestación de flujo (workflow orchestration)**: coordinar un proceso de varios pasos, frecuentemente a través de sistemas distintos y a lo largo del tiempo — "al confirmar la compra: reservar inventario, cobrar la tarjeta, enviar el email de confirmación, y si el cobro falla, liberar la reserva".

**Lógica de presentación (presentation logic)**: cómo se muestra u ordena algo para quien lo ve — orden de una grilla, qué columnas ve un rol distinto de otro, formato de moneda. No tiene ninguna razón de negocio para vivir cerca del dato.

**Invariante**: una propiedad que el sistema garantiza que nunca se viola, en ningún momento, sin importar qué camino de escritura se haya usado. Es el criterio que separa "esto debe ser un constraint" de "esto puede ser una validación de aplicación".

**Constraint**: una restricción declarada en el esquema (`NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`) que el motor de base de datos verifica automáticamente en cada escritura, sin que ningún programa tenga que acordarse de pedirlo.

**Trigger**: un procedimiento que el motor de base de datos ejecuta automáticamente como reacción a un evento (`INSERT`, `UPDATE`, `DELETE`) sobre una tabla. A diferencia de un constraint, un trigger puede ejecutar lógica arbitraria — y por eso mismo es más difícil de razonar y de mantener.

Con estos siete conceptos resueltos, el resto del documento no necesita redefinir nada.

---

## Fase 1 — Extraer la lista completa de reglas candidatas, antes de clasificar ninguna

Las seis preguntas de la Fase 2 clasifican una regla ya identificada. No dicen cómo encontrar esa regla dentro de un MER de varias tablas y un documento de decenas de requerimientos. Saltarse esta fase y empezar a clasificar "las reglas que se me ocurren al leer" produce exactamente el mismo problema que una prueba de MER sin matriz de trazabilidad: se cubren los casos obvios y se pierden los sutiles, que suelen ser los que más importan.

**Paso 1 — Recorrer el 100% de los RF y RNF, sin descartar ninguno por "parecer solo de interfaz".** Para cada requerimiento, leer completa su descripción, sus reglas de negocio, y su resultado esperado (incluyendo los casos de error), y marcar cada frase que describe una condición, una restricción, o una secuencia de pasos — no solo el "camino feliz". Un requerimiento que a primera vista es solo de presentación ("alternar entre vista en grilla y vista en lista") puede no producir ninguna regla candidata, y eso también se anota explícitamente como "sin reglas para clasificar", no se omite en silencio.

**Paso 2 — Para cada frase marcada, decidir si describe una de las cinco categorías de la sección de conceptos previos.** No toda frase de un RF es una regla a clasificar: una frase que solo describe qué columnas mostrar en una pantalla no es una regla de comportamiento, es un requisito de lectura que el MER ya debe sostener (y que la guía de pruebas de MER ya cubre). Las frases que sí cuentan como regla candidata son las que tienen forma de condición o restricción: "no puede ser cero ni negativo", "solo si tiene al menos uno", "se notifica cuando cambia a tal estado", "se descuenta del inventario al transitar a tal estado".

**Paso 3 — Para cada regla candidata, anotar qué tablas y columnas del MER toca.** Esto es necesario para la Pregunta 1 de la Fase 2 (¿es un invariante de una sola fila, o depende de otra tabla?): sin saber de antemano qué columnas están involucradas, no se puede saber si una regla es expresable como `CHECK constraint` o si necesita mirar otra tabla. Si una regla candidata no puede anclarse a ninguna columna o tabla del MER, es una señal de que el esquema todavía no la sostiene — eso es un hallazgo para la guía de pruebas de MER, no algo que esta guía deba resolver inventando una ubicación.

**Paso 4 — Revisar los cruces entre RF relacionados antes de dar la lista por completa.** Algunas reglas no aparecen en un solo RF sino en la intersección de dos: por ejemplo, "el stock no puede reducirse por debajo del stock reservado" (un RF) y "el stock reservado se libera al rechazar un pedido" (otro RF) son, juntas, una sola regla de consistencia entre dos columnas que ningún RF individual deja completamente explícita.

**Paso 5 — Producir la lista de reglas candidatas como una tabla**, con columnas: identificador de la regla (puede reusar el RF de origen, ej. "RF-020-a" si un mismo RF produce más de una regla), texto de la regla en una frase, RF/RNF de origen, y tablas/columnas del MER involucradas. Esta tabla es la entrada de la Fase 2 — cada fila se corre individualmente contra las seis preguntas.

**Cobertura declarada**: al cerrar la Fase 1, se declara cuántos RF y RNF en total se revisaron y cuántas reglas candidatas se extrajeron, igual que en la guía de pruebas de MER, para que la fase pueda auditarse y no quede como un barrido parcial con apariencia de completo.

---

## Fase 2 — El procedimiento de clasificación: las seis preguntas, en orden

Para cualquier regla concreta —no para "la lógica de negocio" como abstracción, sino para una regla puntual como "no se puede eliminar un precio por volumen si tiene pedidos activos que lo referencian"— se hacen estas seis preguntas, en este orden, y se detiene en la primera que aplique.

**Pregunta 1 — ¿Es un invariante que el dato nunca debe violar, sin importar quién escriba?**
Si la respuesta es sí — una clave foránea debe apuntar a una fila real, un saldo nunca puede quedar negativo, un correo debe ser único — la regla va en la **base de datos**, como constraint o, donde el constraint no alcance a expresarlo, en el procedimiento que es dueño de esa escritura. La prueba decisiva: *si una segunda aplicación, un script de corrección de datos, o un proceso de migración escribiera esto mal, ¿sería un desastre?* Si la respuesta es sí, la base es la única capa que ve absolutamente toda escritura, y es la única que puede garantizar el invariante sin depender de que cada programa futuro se acuerde de revalidarlo.

**Pregunta 2 — ¿Opera sobre un conjunto grande de filas ya existentes?**
Si el trabajo es "recalcular el saldo de todas las cuentas", "expirar todas las sesiones de más de 30 días", o "aplicar este cambio de precio a un millón de productos", va **cerca de los datos**, en una instrucción de conjunto (`UPDATE ... WHERE ...`) o un procedimiento almacenado. Traer un conjunto grande a la aplicación para recorrerlo fila por fila y escribirlo de vuelta es el error de rendimiento más común en esta decisión completa: la base está diseñada para operar sobre conjuntos, no sobre objetos uno a la vez.

**Pregunta 3 — ¿Es una regla de dominio compleja, con mucha ramificación condicional, o cambia con frecuencia?**
Si la lógica es "cómo calculamos un descuento promocional según el nivel del cliente, el contenido del carrito, la temporada y tres campañas activas a la vez", normalmente va en un **servicio de la aplicación**, donde un lenguaje de propósito general, un modelo de dominio real, y un ciclo de prueba y despliegue rápido la sirven mejor que SQL. Una regla que cambia cada sprint también tira hacia la aplicación, porque el ciclo de despliegue de la aplicación está construido para el cambio frecuente; el de la base, no.

**Pregunta 4 — ¿Orquesta sistemas externos o un flujo de trabajo de larga duración?**
Si la lógica llama a un proveedor de pagos, programa un envío, manda un correo, o coordina varios servicios a lo largo de segundos o minutos, va en un **servicio de la aplicación**. La base de datos no debería hacer llamadas salientes ni mantener transacciones abiertas mientras espera una respuesta externa.

**Pregunta 5 — ¿Es sobre quién está pidiendo algo y si tiene permiso?**
Autenticación, autorización, límites de frecuencia de uso, y validación de entrada en el borde del sistema van en la **aplicación y la puerta de entrada (API gateway)**. La base de datos puede aplicar qué se puede hacer con el dato *una vez que la petición ya entró* (incluyendo seguridad por fila para aislar inquilinos o usuarios), pero la decisión de identidad sobre quién está pidiendo algo vive por encima de ella.

**Pregunta 6 — ¿Es solo para la experiencia de quien usa el sistema?**
Retroalimentación instantánea —"este campo es obligatorio", "las contraseñas no coinciden"— va en el **cliente** (navegador o app), porque es lo más cercano a quien lo necesita. La regla de oro: la validación del lado del cliente **nunca** es la verificación autoritativa. Toda regla puesta ahí por capacidad de respuesta debe repetirse en una capa que el usuario no pueda evadir.

### El procedimiento en una tabla

| Si la regla es… | Va en… |
|---|---|
| Un invariante verdadero para cualquier escritor | Base de datos (constraint o procedimiento dueño de la escritura) |
| Una operación de conjunto sobre filas existentes | Base de datos (instrucción de conjunto / procedimiento) |
| Una regla de dominio compleja o que cambia seguido | Servicio de la aplicación |
| Orquestación externa o flujo de larga duración | Servicio de la aplicación |
| Identidad, autorización, límite de frecuencia | Aplicación / API gateway |
| Aislamiento de acceso por fila | Base de datos (seguridad de fila) |
| Validación autoritativa | Base y/o servicio (nunca solo el cliente) |
| Retroalimentación rápida de experiencia de uso | Cliente (más una reverificación autoritativa) |

Importante: varias filas dicen "base de datos" y varias dicen "aplicación", y ese es el punto del procedimiento. Un sistema real ejecuta todas estas filas a la vez. El procedimiento no elige un bando; ubica cada regla según sus propiedades específicas.

---

## Qué SÍ va en la base de datos, y cómo expresarlo

**Restricciones de forma del dato (`NOT NULL`, tipo de columna, `UNIQUE`)** — siempre en la base. Ejemplo de sintaxis (PostgreSQL):

```sql
CREATE TABLE empleado (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cedula_identidad varchar NOT NULL UNIQUE,
  salario numeric CHECK (salario > 0)
);
```

**Restricciones que solo dependen de los valores de la misma fila** — `CHECK constraint`. Esto incluye reglas como "el precio de venta no puede ser cero ni negativo" o "la fecha de ingreso debe ser posterior a la fecha de nacimiento":

```sql
ALTER TABLE precio_volumen
  ADD CONSTRAINT precio_venta_positivo CHECK (precio_venta > 0);

ALTER TABLE empleado
  ADD CONSTRAINT fecha_ingreso_posterior CHECK (fecha_ingreso > fecha_nacimiento);
```

**Limitación dura que hay que tener presente**: la documentación oficial de PostgreSQL es explícita en que un `CHECK constraint` no puede evaluar datos de otras filas ni de otras tablas — solo los valores de la fila que se está insertando o actualizando en ese momento. Una regla como "no eliminar un precio por volumen si tiene pedidos en estado Pendiente o Aceptado que lo referencian" **no puede expresarse como un CHECK constraint**, porque necesita mirar otra tabla (`pedido_item`/`pedido`). Para ese tipo de regla hacen falta una `FOREIGN KEY` con la política de borrado adecuada, un trigger, o — más frecuentemente en la práctica — la verificación en la capa de aplicación antes de emitir el `DELETE`.

**Relaciones entre tablas** — siempre `FOREIGN KEY`, nunca solo una convención de nombres de columna verificada "a mano" en el código:

```sql
ALTER TABLE pedido_item
  ADD CONSTRAINT fk_pedido_item_producto
  FOREIGN KEY (producto_id) REFERENCES producto(id);
```

**Aislamiento de filas por usuario o inquilino** — seguridad de fila (`Row-Level Security` en PostgreSQL), cuando el requisito es que cada usuario solo vea o modifique sus propias filas sin importar qué aplicación se conecte:

```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY account_managers ON accounts
  TO managers
  USING (manager = current_user);
```

**Operaciones de conjunto sobre datos existentes** — instrucción `UPDATE`/`DELETE` directa, no un bucle de la aplicación:

```sql
UPDATE producto
SET stock_reservado = stock_reservado - pi.cantidad
FROM pedido_item pi
WHERE producto.id = pi.producto_id
  AND pi.pedido_id = :id_pedido;
```

**Trigger, solo cuando hace falta reaccionar automáticamente a un evento de escritura y la regla no se puede expresar como constraint** — por ejemplo, mantener una columna de auditoría que registre quién modificó la fila y cuándo, sin que cada programa que escribe en la tabla tenga que acordarse de hacerlo:

```sql
CREATE OR REPLACE FUNCTION fn_registrar_modificacion()
RETURNS trigger AS $$
BEGIN
  NEW.modificado_en := now();
  NEW.modificado_por := current_user;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_producto_modificado
  BEFORE UPDATE ON producto
  FOR EACH ROW
  EXECUTE FUNCTION fn_registrar_modificacion();
```

---

## Qué NO va en la base de datos (o va con restricciones fuertes)

**No se pone lógica de presentación en triggers ni en constraints.** Orden de una grilla, qué columna ve un rol y cuál no, formato de moneda — la base no debería saber que existe una pantalla. Acoplar la capa de almacenamiento a la interfaz garantiza dolor la primera vez que aparece una segunda interfaz.

**No se usan triggers como mecanismo por defecto para "cualquier cosa que deba pasar siempre".** La documentación de buenas prácticas de SQL Server (Red Gate/Simple Talk) lo describe con una analogía explícita: los triggers son como las papas fritas en lata — una vez que empezás a usarlos para todo, no podés parar, y cada trigger nuevo hace más difícil predecir qué pasa cuando se escribe en la tabla.

**No se combinan varias responsabilidades distintas en un solo trigger.** Un trigger debe hacer una sola cosa bien. No mezclar auditoría, cálculo de valores por defecto, y actualizaciones en cascada a otras tablas en el mismo trigger — si la lógica crece, hay que migrarla a un procedimiento almacenado explícito (visible si alguien lo busca) en vez de un trigger implícito (invisible hasta que alguien inspecciona el esquema completo).

**No se asume que el orden de ejecución entre varios triggers sobre la misma tabla y el mismo evento está garantizado.** Varía según el motor de base de datos, y si dos triggers actualizan el mismo estado relacionado, el resultado puede volverse no determinístico.

**No se ponen iteraciones fila por fila (`CURSOR`, `WHILE`) dentro de un trigger cuando una instrucción de conjunto podría resolver lo mismo.** Esto convierte una operación que debería tomar una sola pasada en mil pasadas individuales, y es exactamente el tipo de antipatrón de rendimiento que la documentación de SQL Server señala como el más común.

**No se hace que la base de datos llame a sistemas externos.** Un trigger que dispara una petición HTTP hacia otro sistema cada vez que se inserta una fila parece una solución elegante en una prueba de concepto y se vuelve un problema serio en producción: si el sistema externo no responde, la transacción de base de datos queda esperando; si hay miles de inserciones, hay miles de peticiones salientes sin control de flujo ni reintento gestionado desde la base. Esta orquestación pertenece a la aplicación o a una cola de mensajes, no a un trigger.

**No se pone lógica de negocio que cambia con frecuencia (cada sprint, cada campaña) dentro de procedimientos almacenados como única ubicación**, porque el ciclo de despliegue de la base es estructuralmente más lento y más riesgoso de versionar que el de la aplicación — aunque, como se aclara más abajo, el código de la base también debería estar bajo control de versiones y CI/CD, no es una excusa para no documentarlo.

---

## Qué SÍ va en la capa de programación, y cómo expresarlo

**Reglas de dominio con ramificación compleja** — en un objeto o servicio de dominio explícito, no disperso en cada controlador que lo necesite. El antipatrón a evitar aquí, documentado por Martin Fowler como *Anemic Domain Model*, es tener objetos que son solo getters y setters mientras toda la lógica vive en clases de servicio separadas — eso pierde el beneficio de la organización orientada a objetos sin ahorrar nada a cambio.

```python
class PoliticaDescuento:
    def calcular_descuento(self, cliente, carrito, campanas_activas):
        if cliente.nivel == "oro" and carrito.total > 50:
            return carrito.total * 0.15
        # ... más reglas, en un solo lugar con nombre propio
```

**Orquestación de varios pasos, especialmente si llama a sistemas externos:**

```python
def confirmar_pedido(carrito):
    reserva = inventario.reservar(carrito.items)
    try:
        cobro = pagos.cobrar(carrito.total, carrito.metodo_pago)
    except PagoRechazado:
        inventario.liberar(reserva)
        raise
    notificaciones.enviar_confirmacion(carrito.comprador)
    logistica.programar_envio(carrito)
    return cobro
```

**Idempotencia en operaciones que se pueden reintentar** (por ejemplo, si la conexión se cae después de procesar un pago pero antes de confirmarlo al cliente) — usando una clave de idempotencia que el cliente envía y el servicio verifica antes de repetir un efecto:

```python
def procesar_pago(idempotency_key, monto):
    existente = pagos_procesados.buscar(idempotency_key)
    if existente:
        return existente  # ya se procesó, no repetir el cobro
    resultado = pasarela_pago.cobrar(monto)
    pagos_procesados.guardar(idempotency_key, resultado)
    return resultado
```

**Autenticación, autorización a nivel de petición, límites de frecuencia de uso** — en middleware de la aplicación o en la puerta de entrada (API gateway), antes de que la petición llegue a tocar cualquier dato.

**Validación de entrada con mensajes específicos para quien usa el sistema** — porque el constraint de la base puede rechazar el dato, pero normalmente solo devuelve "violación de constraint", no un mensaje que ayude a la persona a corregir lo que escribió. Por eso la validación se duplica a propósito: una vez en la aplicación (para dar el mensaje correcto) y otra vez en la base (como última línea de defensa para cualquier escritor que no pase por esa aplicación).

```python
def validar_precio_volumen(cantidad_minima, precio_venta):
    errores = []
    if cantidad_minima <= 0:
        errores.append("La cantidad mínima debe ser mayor a cero.")
    if precio_venta <= 0:
        errores.append("El precio de venta debe ser mayor a cero.")
    return errores
```

**Verificaciones que necesitan consultar otra tabla antes de decidir si una operación procede** — como la regla que ya identificamos en el caso real de este proyecto (RF-020: antes de eliminar un producto, verificar si existen registros asociados en otras tablas; si existen, deshabilitar en vez de eliminar). Esta verificación *podría* vivir en un trigger `BEFORE DELETE`, pero la pauta de la Pregunta 3 (regla de dominio con ramificación, probable que cambie qué tablas se consultan a medida que el sistema crece) generalmente la inclina hacia la aplicación:

```python
def eliminar_producto(producto_id):
    tiene_referencias = (
        pedido_item.existe_para_producto(producto_id) or
        propuesta_sustitucion.existe_para_producto(producto_id) or
        precio_volumen_proveedor.existe_para_producto(producto_id) or
        pedido_reposicion_item.existe_para_producto(producto_id)
    )
    if tiene_referencias:
        producto.deshabilitar(producto_id)  # habilitado=false, estado_visibilidad='pausado'
    else:
        producto.eliminar(producto_id)  # DELETE físico
```

---

## Qué NO va en la capa de programación (o va con restricciones fuertes)

**No se confía en la validación del cliente (navegador, app móvil) como única barrera para ninguna regla de integridad.** Cualquiera puede abrir las herramientas de desarrollador, evadir la validación de la interfaz, y enviar lo que quiera directo a la API. Toda regla puesta ahí por capacidad de respuesta debe reforzarse en una capa que el usuario no pueda evadir.

**No se reimplementa en la aplicación una operación que opera sobre un conjunto grande de filas existentes recorriéndolas una por una.** Cargar diez mil filas como objetos, modificar cada uno en memoria, y guardarlos de vuelta uno a uno es, según la misma fuente que documenta el framework de seis preguntas, el error de rendimiento más común en esta decisión: lo que en la base es una sola instrucción puede volverse miles de viajes de ida y vuelta a través de un mapeador objeto-relacional.

**No se asume que, porque una regla de integridad ya está validada en la aplicación, no hace falta repetirla en la base.** Cualquier proceso que no pase por esa aplicación específica —migración, script de corrección, segunda aplicación futura, acceso directo de un DBA— puede escribir datos inválidos si la única barrera vivía en un solo programa.

**No se hace que el código de la base de datos quede fuera de control de versiones "porque es solo SQL".** El esquema, los procedimientos almacenados, y las migraciones merecen el mismo rigor de control de versiones, validación automatizada y despliegue controlado que el código de la aplicación — tratar el código de base de datos como una excepción informal a esa disciplina es, en sí mismo, parte de por qué el debate sobre dónde vive la lógica se vuelve más ideológico que técnico.

**No se trata "lógica de negocio" como una categoría única al momento de decidir dónde ubicarla.** Es exactamente el error que hace que este debate sea, según la fuente principal de esta guía, un debate que nunca se resuelve: la pregunta correcta nunca es "¿la lógica de negocio va en la base o en la aplicación?" sino "¿dónde le conviene vivir a esta regla específica, con estas propiedades específicas?".

---

## Cómo NO se aborda esta decisión

**No se elige un bando de forma ideológica ("todo va en stored procedures" o "la base es solo un balde de filas") y se aplica esa postura a cada regla nueva sin pasar por las seis preguntas.** Ambos extremos han construido sistemas exitosos a gran escala (Stack Overflow con SQL escrito a mano del lado de la base; GitHub y Shopify con un ORM pesado del lado de la aplicación), lo cual demuestra que ninguno de los dos extremos es automáticamente incorrecto — lo que sí es incorrecto es decidir sin medir, por identidad de equipo en vez de por evidencia.

**No se decide dónde va una regla basándose en quién la va a programar, en vez de basarse en las propiedades de la regla.** Cuando la discusión se convierte en "yo soy de la aplicación y quiero esto en mi código" o "yo soy DBA y no confío en el equipo de aplicación", la decisión dejó de ser técnica.

**No se pone una regla de orquestación externa (llamadas a otros sistemas, espera de minutos) dentro de la base de datos solo porque "así se ejecuta más rápido".** La velocidad de ejecución de un trigger no cambia el hecho de que el motor de base de datos no está hecho para sostener una transacción abierta mientras espera una respuesta de red de un sistema ajeno.

**No se asume que una regla ya clasificada para otro proyecto aplica igual aquí sin revisar sus propiedades específicas en este caso.** El mismo tipo de regla ("no eliminar si hay referencias") puede resolverse con un trigger en un sistema con pocas tablas relacionadas, y necesitar lógica de aplicación en otro con más tablas y reglas que cambian seguido — el procedimiento de seis preguntas se corre de nuevo cada vez, no se copia el resultado de la última vez.

---

## Checklist final antes de dar una recomendación de ubicación como terminada

Antes de presentar una clasificación de "esto va en la base" o "esto va en la aplicación" como definitiva para el sistema completo, la IA debe verificar, en este orden:

1. ¿Se recorrió el 100% de los RF y RNF en la Fase 1, sin descartar ninguno por "parecer solo de interfaz" sin anotarlo explícitamente como "sin reglas para clasificar"?
2. ¿Cada regla candidata extraída quedó anclada a tablas y columnas concretas del MER, y no quedó ninguna regla "flotando" sin esquema que la sostenga? (si quedó alguna así, es un hallazgo para la guía de prueba de MER, no algo que esta guía deba resolver por sí sola)
3. ¿Se revisaron los cruces entre RF relacionados, no solo cada RF en una burbuja aislada, para detectar reglas que solo aparecen en la intersección de dos requerimientos?
4. ¿Se corrieron las seis preguntas de la Fase 2 en orden contra cada regla específica de la lista, no contra "la lógica de negocio" en general?
5. Si la respuesta fue "base de datos": ¿se confirmó que la regla puede expresarse con los datos de una sola fila (constraint) o, si necesita mirar otra tabla, se identificó correctamente que un CHECK simple no alcanza y hace falta una FK, un trigger, o una verificación de aplicación?
6. Si la respuesta fue "aplicación": ¿se verificó si la misma regla, además, necesita una versión en la base como última línea de defensa (caso típico: integridad que debe sostenerse para cualquier escritor futuro)?
7. ¿Se evitó tratar la decisión como un bando ideológico, revisando si la regla tiene componentes mixtos (la mayoría de las reglas reales tocan más de una de las cinco categorías a la vez)?
8. ¿La recomendación evita poner orquestación externa o flujo de larga duración dentro de la base, y evita poner operaciones de conjunto grandes recorridas fila por fila dentro de la aplicación?
9. ¿Se documentó la decisión (en el esquema, en el código, o en ambos) de forma que alguien que no estuvo en esta conversación pueda entender por qué la regla vive donde vive, sin tener que inspeccionar el comportamiento en producción para descubrirlo?

Si alguna respuesta es "no" o "no se sabe", la recomendación no está lista para entregarse — hay que volver a correr las preguntas correspondientes o decir explícitamente qué quedó sin resolver, no presentar una ubicación como definitiva cuando en realidad fue una suposición.
