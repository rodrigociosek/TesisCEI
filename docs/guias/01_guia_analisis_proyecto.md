# GUÍA 01 — Análisis del Proyecto
## Cómo leer los documentos existentes para entender un requerimiento ANTES de planear su construcción

---

## Qué es este documento y por qué existe

La Guía General (`00`) me dice que esta es la primera parada del mapa. Este documento es el contenido de esa parada: el método exacto para leer cada documento del proyecto, extraer lo necesario, y reconocer cuándo la información alcanza para pasar a planear la construcción y cuándo no.

La razón de que este análisis tenga que ser exhaustivo y no superficial es esta: un RF nunca vive solo. Cada RF depende de un modelo de datos ya definido (el MER), de un diseño de clases ya definido (el diagrama de código), y de una clasificación ya hecha sobre qué parte de cada regla vive en la base de datos y qué parte vive en el servidor. Si empiezo a planear la construcción antes de reunir esas cuatro fuentes, el riesgo no es solo planear algo de mala calidad — es planear algo que contradice un diseño que ya existe: usar un nombre de columna distinto al real, reimplementar en JavaScript una validación que Postgres ya garantiza con una constraint, o poner lógica de negocio en el controlador cuando el diagrama de clases ya decidió que esa responsabilidad vive en el dominio.

Hay además un riesgo previo a todos los anteriores, que solo aparece cuando este sistema de guías se aplica sobre un repositorio que ya tiene código escrito de antes: ese código puede no respetar todavía la nomenclatura del MER y el diagrama de clases, porque fue escrito antes de que este sistema existiera. La Sección 0 de este documento resuelve esa duda una sola vez por repositorio, antes de tocar cualquier RF.

## El estándar en el que se basa el comportamiento de este documento

Cada sección de este documento sigue el patrón **Definition of Ready (DoR) / Definition of Done (DoD)**, usado en metodologías ágiles (Scrum, Extreme Programming) para evitar que se avance sobre trabajo ambiguo:

- **DoR:** condición que debe cumplirse ANTES de empezar una sección. Si no se cumple, no tiene sentido intentar la sección todavía.
- **DoD:** checklist de condiciones objetivas y verificables para considerar la sección CERRADA. Si una sola condición falla, la sección no está terminada — sin excepciones.

## Regla de comportamiento: PARADA DURA

1. No avanzo a la sección N+1 si el DoD de la sección N no está 100% cumplido.
2. Si el DoD falla, me detengo y reporto, en este orden: (a) qué condición específica no se cumplió, (b) qué documento o información falta para cumplirla, (c) si la información debe ser provista por el usuario o si debo producirla yo siguiendo un estándar — y en ese caso, cuál estándar.
4. Nunca relleno un vacío de información inventando contenido. Si un documento no tiene la sección que necesito, lo declaro como vacío real.
5. No me detengo por condiciones que no están en el DoD de cada sección. El DoD define exactamente dónde está la línea, ni más estricto ni más laxo.

---

## SECCIÓN 0 — Diagnóstico de divergencia entre el código ya existente y el diseño (una sola vez por repositorio, no por RF)

**Por qué esta sección existe y por qué va primero:** todas las secciones siguientes de esta guía asumen que el código que ya existe en el repositorio (si existe alguno) respeta la nomenclatura del MER y el diagrama de clases. Cuando un repositorio se retoma con código escrito antes de que estas guías existieran, ese supuesto puede ser falso — y si lo es, construir un RF nuevo encima sin saberlo termina mezclando dos convenciones distintas en el mismo proyecto. Esta sección resuelve esa duda una sola vez, no en cada RF, y queda registrado el resultado para no repetir el trabajo.

**El estándar en el que se basa esta sección:** esto es exactamente lo que la práctica de ingeniería de software llama *auditoría de código heredado contra una especificación* (legacy code audit), cuyo primer paso —antes de cualquier modificación— es siempre un relevamiento del estado real del código, según la literatura estándar de refactorización (Martin Fowler, *Refactoring: Improving the Design of Existing Code*, y la práctica documentada de auditoría previa al refactor). La técnica concreta para hacerlo barato en tokens —que es la que usan agentes de código reales como Aider y Claude Code— es **buscar nombres y firmas con una herramienta de búsqueda de texto (grep/ripgrep) en vez de leer el contenido completo de cada archivo**: se extraen los nombres de tablas, columnas, funciones exportadas y rutas, y esos nombres (no el cuerpo de la lógica) son lo que se compara contra el MER y el diagrama de clases. Leer cada archivo entero de punta a punta para esto sería gastar tokens en contenido que la comparación no necesita.

**DoR:** es la primera vez que se trabaja en este repositorio con este sistema de guías, O no existe todavía un registro de este diagnóstico guardado en el repo (ver DoD de esta sección, último punto).

**Condición de salto (no ejecutar esta sección si se cumple):** si ya existe en el repositorio un archivo `docs/proyecto/diagnostico_divergencia.md` (o equivalente) de una ejecución anterior de esta sección, y ningún archivo de `/backend` o `/frontend` cambió desde la fecha de ese diagnóstico, esta sección se salta por completo — se asume vigente el resultado anterior, sin gastar tokens en repetirlo.

**Qué hago, en este orden, optimizado para no leer más de lo necesario:**

1. **Listar la estructura, no el contenido.** Listo los nombres de archivo y carpetas de `/backend` y `/frontend` (profundidad razonable, sin entrar a `node_modules` ni carpetas de dependencias) — todavía sin abrir ningún archivo.
2. **Extraer firmas de la base de datos, no las consultas completas.** Si existe una carpeta de modelos, migraciones, o configuración de base, busco (con una herramienta de búsqueda de texto, no leyendo archivo por archivo) los nombres de tabla y columna que el código ya usa — por ejemplo, buscando los patrones que normalmente delatan un nombre de tabla o columna (`CREATE TABLE`, `FROM `, `INSERT INTO`, nombres de propiedades en un esquema). Reúno una lista de nombres encontrados, sin necesidad de leer la lógica completa de cada archivo.
3. **Extraer firmas de funciones/métodos, no su cuerpo.** Busco las líneas que declaran funciones exportadas o métodos de clase (el encabezado de la función: nombre y parámetros), sin leer el cuerpo completo de cada una salvo que el nombre ya levante una sospecha de discrepancia.
4. **Comparar esas dos listas de nombres contra el MER (Sección 3 de esta guía) y el diagrama de clases (Sección 4).** Para cada nombre de tabla/columna/método ya existente en el código, verifico si coincide exactamente con su equivalente en el MER/diagrama, o si diverge (nombre distinto, tipo distinto, método con otra firma).
5. **Registrar el resultado**, no solo concluirlo de memoria: guardo en `docs/proyecto/diagnostico_divergencia.md` la fecha del diagnóstico y la lista de divergencias encontradas (o la confirmación de que no hay divergencias), para que la condición de salto de esta misma sección funcione en el futuro sin tener que repetir el trabajo.

**DoD:**
- [ ] Tengo la lista de nombres de tabla/columna que el código de `/backend` ya usa, sin haber necesitado leer el cuerpo completo de la lógica de cada archivo para obtenerla.
- [ ] Tengo la lista de firmas de función/método que el código ya usa, de la misma forma.
- [ ] Comparé ambas listas contra el MER y el diagrama de clases, y tengo identificadas las divergencias reales (si las hay) — no asumí que "probablemente coincide" sin haber comparado.
- [ ] Guardé el resultado en `docs/proyecto/diagnostico_divergencia.md`, con fecha, para que esta sección se pueda saltar en el futuro mientras el código no cambie.

**Si el DoD falla, o si se encuentran divergencias:** no se construye el primer RF nuevo todavía. Se reporta al usuario la lista exacta de divergencias encontradas (nombre en el código vs. nombre en el MER/diagrama), y se pregunta cómo proceder: (a) corregir el código existente para que coincida con el diseño, (b) corregir el MER/diagrama si el código existente refleja una decisión válida que el diseño no capturó, o (c) documentar la divergencia como una excepción consciente y seguir adelante solo si el usuario lo autoriza explícitamente — nunca se elige una de estas tres opciones por cuenta propia.

---

## SECCIÓN 1 — Localizar el requerimiento exacto

**DoR:** Sección 0 cerrada (con DoD cumplido o saltada legítimamente por su condición de salto), y tengo un ID de RF (ej. "RF-014") o una descripción suficientemente concreta para ubicarlo sin ambigüedad en `seccion_1_8_lista_requerimientos.md`. Si solo tengo una descripción, la primera tarea de esta sección es resolver el ID exacto antes de continuar.

**Qué hago:**
- Busco el bloque completo del RF en `seccion_1_8_lista_requerimientos.md`.
- Extraigo, citando textualmente: **Descripción**, **Reglas de negocio**, **Resultado esperado**.
- Busco el mismo RF en `seccion_1_8_casos_de_uso.md` (las secciones de Casos de Uso, CU, suelen referenciar su RF correspondiente). Si existe correspondencia, extraigo el **Curso Normal** y el **Curso Alterno** — estos son casos de prueba adicionales y no opcionales: el Curso Alterno típicamente cubre los mensajes de error y casos límite que el "Resultado esperado" resume de forma más compacta.

**DoD:**
- [ ] Encontré el bloque del RF en `seccion_1_8_lista_requerimientos.md`. Si no existe con ese ID, me detengo y reporto la inconsistencia.
- [ ] Cité textualmente las 3 secciones (Descripción, Reglas de negocio, Resultado esperado) sin inventar contenido.
- [ ] Si existe un CU correspondiente, extraje también su Curso Normal y Curso Alterno completos.
- [ ] Si alguna sección está vacía o ausente en el documento original, lo señalé explícitamente como vacío real — no lo completé por mi cuenta.

**Si el DoD falla:** me detengo. Reporto qué sección falta y pregunto si (a) el usuario tiene esa información en otro lado, o (b) debo producirla yo — y de ser así, indico qué estándar usaría (este proyecto ya sigue el formato ISO/IEC/IEEE 29148:2018 para estructurar sus RF, según el encabezado del propio documento de requerimientos) y espero confirmación antes de escribir nada nuevo.

---

## SECCIÓN 2 — Clasificar qué pertenece a la base de datos y qué pertenece a la programación

**DoR:** Sección 1 cerrada con DoD cumplido.

**Por qué esta sección existe:** este proyecto ya tiene un trabajo de clasificación hecho en `bd_vs_programacion_distribuidora.md`, que separa para cada RF qué regla se resuelve con una constraint de PostgreSQL (UNIQUE, NOT NULL, CHECK, FK, default) y qué regla se resuelve con lógica de servidor (validaciones, mensajes de error, llamadas a servicios externos). Si no consulto este documento antes de planear, corro el riesgo de reimplementar en JavaScript una regla que la base ya garantiza, duplicando la validación y arriesgando que las dos versiones queden inconsistentes con el tiempo — exactamente el tipo de duplicación que el principio DRY (Don't Repeat Yourself) busca evitar.

**Qué hago:**
- Busco el RF en `bd_vs_programacion_distribuidora.md`.
- Extraigo qué está marcado como "Base de datos" y qué está marcado como "Programación".
- Si el documento indica que ciertas validaciones de servidor existen solo para dar un mensaje de error amigable ANTES de que la base rechace la operación (patrón que aparece repetido en este documento, por ejemplo en RF-009), anoto ese matiz: la regla real vive en la constraint, el servidor solo anticipa el mensaje.

**DoD:**
- [ ] Encontré la entrada de este RF en `bd_vs_programacion_distribuidora.md`.
- [ ] Tengo claro qué reglas ya están garantizadas por la base de datos.
- [ ] Tengo claro qué reglas son responsabilidad exclusiva del servidor.
- [ ] Si hay una validación de servidor que "adelanta" una constraint de base, lo anoté como tal (no como una regla nueva e independiente).

**Si el DoD falla:** Si el RF no aparece en este documento, dos posibilidades: (a) es uno de los RF de presentación pura sin reglas de BD/programación, que el propio documento declara explícitamente en su sección de cobertura — en ese caso, registro que no aplica clasificación y continúo; (b) es un vacío real de cobertura no declarado, en cuyo caso me detengo y pregunto si debo producir yo esa clasificación, siguiendo el mismo criterio que usa el documento original: para cada regla del RF, preguntar "¿esto lo puede garantizar el esquema de datos por sí solo, o necesita lógica ejecutable que reaccione a una condición?" — si la respuesta es la primera, es de base de datos; si es la segunda, es de programación.

---

## SECCIÓN 3 — Extraer la forma exacta de los datos (PostgreSQL / MER)

**DoR:** Sección 2 cerrada con DoD cumplido, y el RF involucra datos persistentes. Si el RF es interfaz pura sin persistencia (por ejemplo, navegación entre modos, según ya señala `bd_vs_programacion_distribuidora.md` para casos como RF-013), esta sección se marca explícitamente como "no aplica" — nunca se omite en silencio, se documenta la decisión.

**Qué hago:**
- Busco en `mer_distribuidora.md` la(s) tabla(s) involucradas en este RF.
- Extraigo: nombre exacto de la tabla (en snake_case, convención estándar de PostgreSQL), columnas, tipos, constraints (PK, FK, UNIQUE, NOT NULL, CHECK, default), y enums asociados (declarados como `Enum nombre_enum { valor_a valor_b }` en el DBML).
- Fijo la traducción de nomenclatura snake_case (PostgreSQL) → camelCase (JavaScript) para cada columna que voy a usar, ANTES de escribir cualquier línea de SQL o de JS — esto evita improvisar la traducción a mitad de la implementación y que dos archivos distintos terminen llamando al mismo campo de dos formas distintas.
- **Regla de idioma:** los nombres de tabla, columna, clase, método y variable que representan conceptos del dominio se escriben en español, igual que el MER y el diagrama de clases. No se traducen al inglés bajo ningún motivo: `usuario` no se convierte en `user`, `pedido` no se convierte en `order`, `obtenerStockDisponible` no se convierte en `getAvailableStock`. Lo que es sintaxis del lenguaje o nombre fijo de una librería se mantiene como esa librería lo define.
- Leo las `Note:` del DBML cuando existen — frecuentemente documentan el motivo de una constraint (por ejemplo, por qué `telefono` es UNIQUE, o por qué `perfil_configurado` empieza en `false`), y ese motivo es información de negocio que no debería perderse al traducir a código.

**DoD:**
- [ ] Tengo el nombre exacto de cada tabla y columna involucrada, tal como aparece en el DBML — no un nombre que "me parece razonable" o que recuerdo de forma aproximada.
- [ ] Tengo identificadas las constraints relevantes para este RF, en particular las que garantizan una regla de negocio (no solo las puramente estructurales como la PK).
- [ ] Tengo la traducción snake_case → camelCase de cada campo que voy a usar en código.
- [ ] Si hay enums de PostgreSQL involucrados, los relacioné con su equivalente en el diagrama de clases (Sección 4) — el MER los declara en snake_case minúscula como valores del enum, mientras que el diagrama de clases los formaliza en UPPER_SNAKE_CASE; ambos representan el mismo conjunto de valores.

**Si el DoD falla:** me detengo. Si la tabla no existe en el MER pero el RF la necesita, esto es un vacío de diseño real — no invento una estructura de tabla por mi cuenta. Pregunto si debo proponer una extensión al MER siguiendo la misma convención DBML que ya usa el documento (la propia nota de versión de `mer_distribuidora.md` referencia su "guía estándar para construir un MER en DBML" como el estándar a seguir para cualquier extensión).

---

## SECCIÓN 3.5 — Localizar la pantalla correspondiente en el wireframe HTML

**DoR:** Sección 3 cerrada con DoD cumplido, y el RF involucra una pantalla o componente visual (si el RF es puramente de backend sin interfaz, esta sección se marca como "no aplica" y se documenta esa decisión).

**Por qué esta sección existe:** el wireframe (`Wireframes — Marketplace Mayorista.html`) ya define, en fidelidad media, cómo se ve cada pantalla del sistema — qué elementos contiene, cómo se distribuyen, y qué comportamiento tiene en sus casos límite. Si construyo un componente de React sin consultarlo, corro el riesgo de inventar una estructura visual distinta a la ya decidida, exactamente el mismo riesgo que ya se evita en las Secciones 3 y 4 respecto al MER y al diagrama de clases.

**El patrón real del archivo, verificado contra el HTML del proyecto (no es una suposición genérica):** cada pantalla del wireframe es una etiqueta `<section data-label="Nombre de la pantalla · Desktop|Mobile">`. Dentro de cada una, hacia el final, hay un panel de metadatos con etiquetas fijas en este orden: `CU relacionados`, `Rol`, `Modelo estructural` (no siempre presente), `Estado vacío` (no siempre presente), `Comportamiento`, `Accesibilidad`. El valor de cada etiqueta vive en un `<div>` con `background:#E6E6E6` inmediatamente después de la etiqueta. La conexión con el RF específico está siempre en el texto de ese valor, en el formato literal `CU-XX — RF-XXX` (a veces con varios RF separados por `·` o `/`, ej. `CU-26 — RF-024/RF-025/RF-026/RF-027/RF-030`).

**Qué hago, optimizado para no leer el archivo completo (que tiene varios miles de líneas):**
1. Busco (con una herramienta de búsqueda de texto, no leyendo el archivo entero) el patrón `RF-0XX` o `RF-XXX` correspondiente al número exacto del RF que estoy construyendo, dentro del archivo del wireframe.
2. Si hay coincidencia, identifico a qué `<section data-label="...">` pertenece esa coincidencia — subo desde la línea encontrada hasta la apertura de `<section>` más cercana hacia arriba para obtener el nombre de la pantalla.
3. Leo el contenido completo de esa sección puntual (no del archivo entero) para extraer su estructura visual: layout, componentes presentes, y el resto de su panel de metadatos (`Rol`, `Comportamiento`, `Accesibilidad`, `Estado vacío`).
4. Si el RF tiene tanto versión Desktop como Mobile (dos `<section>` distintas con el mismo nombre base y distinto sufijo `· Desktop` / `· Mobile`), leo ambas — un componente de React responsivo necesita conocer las dos.

**DoD:**
- [ ] Encontré la(s) sección(es) del wireframe correspondientes a este RF, vía búsqueda de texto del patrón `RF-XXX`, sin haber necesitado leer el archivo completo de punta a punta.
- [ ] Tengo identificada la estructura visual ya decidida (qué elementos contiene la pantalla, cómo se distribuyen) para usarla como base del componente, en vez de inventar una estructura nueva.
- [ ] Tengo el contenido de los campos `Rol`, `Comportamiento`, `Estado vacío` y `Accesibilidad` de esa pantalla, si existen — son requisitos de comportamiento ya decididos, no solo referencia visual.
- [ ] Si el RF tiene versión Desktop y Mobile, tengo ambas.

**Si el DoD falla:** si el RF no tiene ninguna pantalla asociada en el wireframe, dos posibilidades: (a) es un RF de backend puro sin interfaz, en cuyo caso esta sección no aplica y se documenta así; (b) es un vacío real de cobertura del wireframe, en cuyo caso me detengo y pregunto si debo proponer una estructura de pantalla nueva siguiendo el mismo patrón visual ya usado en el resto del wireframe (paneles `surface-container`, tipografía y espaciados ya establecidos — ver Guía 07), en vez de inventar un estilo distinto al del resto del proyecto.

---

## SECCIÓN 4 — Extraer el comportamiento exacto (diagrama de clases)

**DoR:** Sección 3.5 cerrada (o marcada como no aplica) con DoD cumplido.

**Qué hago:**
- Busco en `diagrama_codigo_completo.md` la(s) clase(s) de dominio involucradas en este RF.
- Extraigo: atributos (en camelCase), métodos ya definidos con su firma exacta (nombre, parámetros con sus tipos, tipo de retorno), y relaciones con otras clases.
- Distingo el tipo de relación porque determina el comportamiento de persistencia: composición (`*--`, ej. `Distribuidor "1" *-- "0..*" Empleado`) significa que el hijo no tiene sentido sin el padre; asociación simple (`--`) es una referencia entre entidades independientes; dependencia (`..>`) significa que una clase usa a otra temporalmente como tipo de un atributo o de una firma de método, sin guardar una referencia estructural permanente.
- Verifico si el método que el RF necesita ya existe en el diagrama (en cuyo caso solo lo implemento con la firma exacta que ya tiene) o si el diagrama no contempla esa operación todavía.

**DoD:**
- [ ] Identifiqué la clase de dominio correspondiente en el diagrama.
- [ ] Tengo la firma exacta de cada método relevante para este RF — no un método "equivalente" que decido nombrar distinto.
- [ ] Entiendo el tipo de relación de esa clase con las demás clases involucradas en el RF (esto determina, por ejemplo, si una validación necesita consultar una tabla relacionada, o si una eliminación debe propagarse).
- [ ] Si el RF requiere un comportamiento que el diagrama no contempla, lo señalé explícitamente como una posible omisión del diagrama, en vez de improvisar la firma del método sin avisar.

**Si el DoD falla:** me detengo y reporto la omisión, preguntando si el método debe agregarse al diagrama — y de ser así, siguiendo la misma convención de nomenclatura ya usada en el resto del diagrama (verbo en infinitivo conjugado en presente, camelCase, ej. `validarCantidadPedido`, `obtenerStockDisponible`) antes de inventar una firma nueva sobre la marcha.

---

## SECCIÓN 5 — Síntesis: ¿la información alcanza para planear la construcción?

**DoR:** Secciones 1 a 4 cerradas (las que aplican al RF en cuestión).

**Qué hago:** reúno en un solo bloque, antes de pasar a la Guía General Parada 2, lo siguiente:
- El RF, con sus reglas y resultado esperado (Sección 1).
- Qué es de base de datos y qué es de programación (Sección 2).
- Las tablas/columnas exactas a usar (Sección 3).
- Los métodos y relaciones exactos a implementar (Sección 4).

**DoD:**
- [ ] Las cuatro secciones anteriores cerraron con su DoD cumplido (o marcadas explícitamente como no aplica, con justificación).
- [ ] No quedó ningún nombre de tabla, columna, método o regla de negocio que esté "asumiendo" en vez de haber confirmado contra un documento.

**Si el DoD falla:** no se pasa a planear la construcción. Se reporta al usuario exactamente qué pieza de información sigue faltando, de cuál de las cuatro secciones, y se repite el procedimiento de esa sección (proveer la información o producirla siguiendo el estándar correspondiente) antes de continuar.
