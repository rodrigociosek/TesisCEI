# GUÍA 02 — Criterio de Simplicidad
## Cómo reconocer si lo que estoy a punto de construir es simple o complejo, ANTES de construirlo

---

## Por qué este documento tiene el formato que tiene (y no DoR/DoD, ni bloques de referencia)

Las guías 00 y 01 usan DoR/DoD a nivel de fases/secciones completas, porque su trabajo tiene una secuencia clara con entrada y salida: se lee algo, se extrae algo, se cierra una sola vez por RF. Las guías 03/04/05 también usan DoR/DoD, pero a nivel de bloque temático: cada bloque (una ruta, una transacción, un componente) tiene su propio DoR/DoD que se aplica cada vez que ese tema vuelve a aparecer dentro del mismo RF — no una sola vez por todo el proyecto. Esa diferencia de granularidad es la razón por la que las guías 03/04/05 no se "cierran" como un todo: se consultan bloque por bloque, tantas veces como ese tema reaparezca.

Este documento es distinto a ambos casos, y por una razón concreta: el riesgo que busca prevenir —sobre-diseñar, agregar capas y abstracciones que el proyecto no necesita— ya ocurrió para el momento en que cualquier checklist de cierre lo detectaría. Un DoD que se revisa al final de una tarea llega tarde: el código sobrecomplicado ya está escrito. Y una guía de referencia pasiva tampoco funciona, porque depende de que la IA decida por su cuenta consultarla — y la tendencia documentada de los modelos de lenguaje es justamente no detenerse a dudar antes de escribir una capa nueva, sino añadirla por costumbre del patrón más común en el código con el que fueron entrenados (la propia documentación oficial de React señala esto explícitamente respecto al uso de `useEffect`, y es un sesgo generalizable a otras decisiones de arquitectura).

Por eso este documento tiene forma de **árbol de decisión obligatorio**: una serie de preguntas de sí/no que se responden en el momento exacto de diseñar una pieza nueva, antes de escribirla — no después. La regla de fondo es siempre la misma: **el default es la opción simple; la opción compleja necesita ganarse su lugar respondiendo que sí a una pregunta concreta, nunca se asume "por si acaso" o "para que sea más robusto".**

## El estándar en el que se basa este criterio

Esto es la aplicación práctica de tres principios ya confirmados como estándar de la industria para este tipo de decisión:

- **YAGNI (You Aren't Gonna Need It):** principio de Extreme Programming (Kent Beck, Ron Jeffries) — no se construye una capacidad hasta que hay una necesidad real y presente, no una hipotética necesidad futura.
- **KISS (Keep It Simple, Stupid):** ante dos soluciones que resuelven el mismo problema, se elige la que es más fácil de entender y mantener, no la más sofisticada.
- **DRY (Don't Repeat Yourself), aplicado con matiz:** evitar duplicar lógica es válido, pero solo cuando dos piezas de código son realmente la misma cosa con el mismo propósito — unificar prematuramente dos cosas que solo se ven parecidas hoy, pero que representan conceptos distintos del dominio, es una forma de complejidad innecesaria tan dañina como la duplicación misma.

---

## ÁRBOL DE DECISIÓN 1 — ¿Necesito una librería externa nueva?

Esta pregunta aplica cada vez que, durante la construcción de un RF, surge la tentación de instalar un paquete nuevo (de gestión de estado, de validación, de UI, de utilidades).

```
¿React/Express/PostgreSQL nativos (o lo ya instalado en el proyecto)
pueden resolver esto con una cantidad razonable de código?
   │
   ├── SÍ → usar lo nativo. FIN. No se instala nada nuevo.
   │
   └── NO, genuinamente no pueden, o el código nativo sería
       desproporcionadamente largo y propenso a error
       (ej. hashear contraseñas a mano en vez de usar bcrypt)
          │
          ▼
       ¿Esta necesidad está confirmada por un RF real ya
       identificado (Guía 01), no por una posibilidad futura?
          │
          ├── SÍ → instalar la librería mínima necesaria para
          │        ese caso puntual, documentando en el código
          │        (o en un comentario breve) qué problema
          │        concreto resuelve.
          │
          └── NO → no se instala. Se resuelve cuando el RF que
                   realmente lo necesite aparezca.
```

**Ejemplo aplicado a este proyecto:** la Guía 04 (React) ya resolvió este árbol para gestión de estado: `useState`/`useReducer`/`Context` nativos cubren las necesidades actuales del proyecto (RF de catálogo, carrito, pedidos descritos en el MER y diagrama de clases) sin necesitar Redux, Zustand ni TanStack Query. Si en algún punto un RF específico demuestra una necesidad real (por ejemplo, sincronización compleja de cache entre muchas vistas), ese sería el momento de volver a este árbol, no antes.

---

## ÁRBOL DE DECISIÓN 2 — ¿Necesito una capa de abstracción nueva?

Esta pregunta aplica cuando, al estructurar el código de un RF, surge la tentación de crear una capa intermedia nueva (un "repositorio" además del servicio, una interfaz genérica, un patrón de diseño formal).

```
¿Existe HOY más de un lugar en el código que necesita
la misma lógica exacta (no parecida, la misma)?
   │
   ├── NO → no crear la abstracción todavía. Escribir la
   │        lógica directamente donde se usa (en el servicio
   │        correspondiente, según la Guía 03, Bloque 1).
   │        Cuando un segundo caso real aparezca y necesite
   │        lo mismo, ahí se extrae la abstracción común.
   │
   └── SÍ, ya hay 2+ usos reales y verificables hoy
          │
          ▼
       ¿La extracción de esa lógica compartida hace el código
       más fácil de leer, o más difícil (porque ahora hay que
       saltar a otro archivo para entender qué hace)?
          │
          ├── Más fácil → extraer la función/módulo compartido.
          └── Más difícil → mantenerlo duplicado; la duplicación
                             de 2 casos simples es preferible a
                             una abstracción que oscurece el código.
```

**Por qué la primera pregunta exige "HOY" y no "podría":** esto es la cláusula central de YAGNI — la abstracción se gana el derecho a existir con evidencia presente (dos usos reales en el código ya escrito), no con una proyección de que "probablemente se va a repetir".

---

## ÁRBOL DE DECISIÓN 3 — ¿Esta validación o regla debe ir en el servidor, si ya existe en la base de datos?

Esta pregunta conecta directamente con la Guía 01 (Sección 2) y la Guía 05 (Bloque 5): cada vez que estoy a punto de escribir una validación en JavaScript, antes de escribirla:

```
¿Esta misma regla ya está garantizada por una constraint
de PostgreSQL (UNIQUE, NOT NULL, CHECK, FK), según el MER
(Guía 01, Sección 3)?
   │
   ├── SÍ → no reimplemento la regla completa en JavaScript.
   │        Como mucho, agrego una verificación previa SOLO
   │        si necesito dar un mensaje de error amigable antes
   │        de que la base la rechace (ver Guía 05, Bloque 5) —
   │        pero la garantía real sigue siendo la constraint,
   │        no mi verificación previa.
   │
   └── NO, la base no puede garantizar esto por sí sola
       (ej. comparar contra la hora actual, llamar a un
       servicio externo, lógica condicional con varios pasos)
          │
          ▼
       Esto es responsabilidad del servidor (Guía 03).
       Se implementa ahí, una sola vez, en el servicio
       correspondiente — no se repite la misma verificación
       en el controlador y en el servicio a la vez.
```

---

## ÁRBOL DE DECISIÓN 4 — ¿Necesito una tabla, columna o relación nueva que el MER no contempla?

```
¿El MER (mer_distribuidora.md) ya tiene una tabla/columna/
relación que cubre esto, aunque con otro nombre que el que
yo hubiera elegido?
   │
   ├── SÍ → usar la existente, con su nombre real (Guía 01,
   │        Sección 3). No crear una columna paralela "más
   │        clara" a mi criterio.
   │
   └── NO, genuinamente no existe
          │
          ▼
       Esto es un vacío de diseño real (Guía 01, Sección 3,
       condición de DoD fallido). Se detiene el flujo y se
       pregunta al usuario antes de inventar una estructura
       nueva — nunca se agrega una tabla o columna al esquema
       real sin pasar primero por esa conversación.
```

---

## REGLA DE PRECEDENCIA — Qué hacer cuando dos guías parecen empujar en direcciones distintas

**Por qué esta regla existe:** la mayoría de los RF de este proyecto tocan más de una capa a la vez (base de datos, servidor, interfaz — Guía 00, Parada 2). Cuando eso pasa, puede aparecer una situación que se LEE como contradicción entre dos guías técnicas, sin serlo en realidad. El ejemplo real de este proyecto: la Guía 03 (Express, Bloque 3) pide validar en el servidor que `consentimientoDatosOtorgado` llegó marcado, ANTES de llamar al servicio; la Guía 05 (PostgreSQL, Bloque 5) dice que la garantía real de una regla de negocio es la constraint de la base, no una verificación previa en JavaScript. Sin esta regla, alguien podría leer esto como "¿entonces valido en el servidor o no?" y elegir mal.

**La resolución no es elegir una guía sobre la otra — es reconocer que cada una responde una pregunta distinta:**

- La Guía 03 (Express) responde: *¿esta entrada tiene la forma correcta antes de intentar la operación?* — esto es validación de forma, y su propósito es dar un mensaje de error rápido y claro al usuario, evitando una llamada a la base que de antemano se sabe que va a fallar.
- La Guía 05 (PostgreSQL) responde: *¿qué es lo que realmente garantiza que el dato final en la base sea correcto, sin importar por dónde haya llegado?* — esto es integridad de datos, y su propósito es que ningún camino (un bug en el servidor, una llamada directa a la API sin pasar por el formulario, una condición de carrera) pueda dejar un dato inconsistente.

**Regla de precedencia, en una frase:** la validación de forma en el servidor (Guía 03) y la garantía de integridad en la base (Guía 05) NUNCA compiten por la misma responsabilidad — la primera existe para dar una buena experiencia al usuario legítimo, la segunda existe para que el sistema sea correcto incluso si la primera falla o se evita. Las dos coexisten siempre que la regla de negocio tenga una constraint real detrás (Árbol 3 de esta guía); si no la tiene, toda la responsabilidad cae en el servidor, sin esta tensión.

**Cómo reconocer si dos guías están en conflicto real (no solo aparente):** antes de asumir una contradicción, identificar qué pregunta responde cada una (¿forma de entrada? ¿integridad de datos? ¿experiencia de interfaz? ¿estructura de código?). Si responden preguntas distintas, no hay conflicto — aplican ambas. Si genuinamente responden la misma pregunta con respuestas distintas (esto no debería ocurrir entre las guías de este proyecto; si ocurre, es un error de redacción en una de las dos), me detengo y reporto la contradicción real al usuario en vez de elegir una a criterio propio.

---

## Señal de alarma general (aplica a los 4 árboles anteriores)

Si en algún momento me encuentro pensando alguna de estas frases, es la señal de que estoy a punto de violar el criterio de simplicidad de este documento, y debo detenerme a pasar por el árbol correspondiente antes de seguir escribiendo:

- "Esto lo voy a necesitar más adelante, mejor lo dejo preparado ahora."
- "Por si después hay que escalar esto..."
- "Es más prolijo si lo separo en su propia capa/módulo/clase."
- "Esta librería lo hace mejor que escribirlo a mano" (sin haber confirmado primero que escribirlo a mano sea genuinamente desproporcionado).

Ninguna de estas frases es, por sí misma, una razón válida para añadir complejidad — son exactamente el tipo de razonamiento que YAGNI identifica como la fuente más común de trabajo desperdiciado y código más difícil de mantener.
