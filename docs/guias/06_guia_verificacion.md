# GUÍA 06 — Verificación
## Cómo confirmar que lo construido cumple exactamente lo que el RF pedía

---

## Qué es este documento y por qué existe

Esta es la última parada del mapa (Guía 00, Parada 4). Su trabajo es comprobar, con evidencia concreta y no con una impresión general, que el código construido para un RF hace exactamente lo que ese RF pedía — ni más, ni menos, ni distinto.

La razón de que esto necesite su propio documento, y no sea solo "probar el código antes de terminar", es que este proyecto ya tiene los casos de prueba escritos de antemano: el "Resultado esperado" de cada RF (en `seccion_1_8_lista_requerimientos.md`) y el Curso Alterno de su Caso de Uso correspondiente (en `seccion_1_8_casos_de_uso.md`) están redactados, ya desde el origen, en formato de caso de prueba — "si pasa esta condición, el sistema hace esto; si pasa esta otra, hace esto otro". Ignorar esa estructura y probar el código "a ojo" sería desperdiciar información que el proyecto ya tiene resuelta.

## El estándar en el que se basa este documento

El patrón **Definition of Done (DoD)** de metodologías ágiles, igual que en las Guías 00 y 01: un conjunto de condiciones objetivas y verificables que deben cumplirse TODAS para considerar el trabajo terminado — no una sensación de "esto ya funciona bien". A esto se suma el concepto de **criterios de aceptación** (acceptance criteria), que en ingeniería de requerimientos son las condiciones específicas, normalmente derivadas directamente del propio requerimiento, contra las que se valida que una implementación es correcta — en este proyecto, esos criterios de aceptación ya están escritos: son el "Resultado esperado" y el Curso Alterno de cada RF.

## Regla de comportamiento: PARADA DURA

Si cualquier caso de prueba de esta guía falla, el RF NO se marca como terminado. Se reporta exactamente qué caso falló, cuál era el comportamiento esperado (citado del documento original) y cuál fue el comportamiento real observado, y se vuelve a la parte del flujo (Guía 00) que corresponda corregir — nunca se documenta el fallo como "pendiente de ajuste menor" y se avanza igual.

---

## SECCIÓN 1 — Reunir los casos de prueba (sin inventar ninguno nuevo todavía)

**DoR:** la Guía 01, Sección 1, ya extrajo el "Resultado esperado" y el Curso Alterno completos de este RF — si no los tengo a mano, vuelvo ahí antes de continuar aquí.

**Qué hago:**
- Convierto cada viñeta del "Resultado esperado" en un caso de prueba individual: condición de entrada → resultado esperado exacto (incluyendo el texto literal del mensaje, si el RF especifica un mensaje).
- Convierto cada bloque `[E1]`, `[E2]`... del Curso Alterno en un caso de prueba individual adicional.
- Si el RF tiene reglas de negocio que implican un límite numérico o temporal (ej. "el código vence a los 10 minutos", "cantidadMinima"), agrego explícitamente el caso límite (justo antes y justo después del límite) como casos de prueba adicionales, aunque el documento original no los enumere uno por uno — esto es estándar en pruebas de software (análisis de valores límite) y no es "inventar" un caso, es hacer explícito un caso que la regla de negocio ya implica.

**DoD:**
- [ ] Tengo un caso de prueba individual por cada viñeta del "Resultado esperado".
- [ ] Tengo un caso de prueba individual por cada bloque de Curso Alterno, si existe.
- [ ] Tengo los casos límite de cualquier regla numérica/temporal del RF, si aplica.
- [ ] Ningún caso de prueba contiene una condición o resultado que no esté basado en el texto original del RF/CU, o derivado directamente de él (como los valores límite).

**Si el DoD falla:** vuelvo a la Guía 01, Sección 1 — el problema no es de esta guía, es que la extracción original quedó incompleta.

---

## SECCIÓN 1.5 — Detectar dependencias hacia otros RF que todavía no existen

**Por qué esta sección existe:** este proyecto tiene un alto nivel de interrelación entre módulos (ver las relaciones de composición y asociación del diagrama de clases en la Guía 01, Sección 4). Es realista que, al reunir los casos de prueba de la Sección 1, aparezca un caso cuyo resultado esperado depende de algo que pertenece a OTRO RF que todavía no se construyó — por ejemplo, verificar RF-014 (carga de producto) puede requerir que exista una `Categoria` ya creada, y la gestión de categorías puede ser un RF distinto, separado.

**DoR:** Sección 1 cerrada con DoD cumplido.

**Qué hago:**
- Para cada caso de prueba de la Sección 1, identifico si su condición de entrada o su resultado esperado depende de datos, una tabla, o un comportamiento que pertenece a un RF distinto al que estoy verificando.
- Si encuentro una dependencia de este tipo, verifico contra la Guía 01 (Sección 3 y 4 de ese OTRO RF, si ya se ejecutó la Guía 01 para él) si ese RF dependiente ya está construido y verificado, o no.

**DoD:**
- [ ] Identifiqué todas las dependencias hacia datos o comportamiento de otros RF que los casos de prueba de la Sección 1 necesitan.
- [ ] Para cada dependencia identificada, sé si el RF del que depende ya está construido y verificado (Guía 06 ya ejecutada para él) o no.

**Si una dependencia apunta a un RF NO construido todavía:** no se inventa el dato o comportamiento faltante para poder seguir probando (eso falsearía la prueba). Se reporta al usuario, en este orden: (a) qué caso de prueba de este RF depende de qué otro RF, (b) que ese RF dependiente no está construido ni verificado todavía, (c) las dos opciones disponibles: construir primero el RF dependiente (volviendo a la Guía 00 para ese RF) y luego retomar la verificación de este, o —si el usuario lo autoriza explícitamente y solo para efectos de prueba— simular el dato faltante de forma clara y reversible (por ejemplo, una fila de prueba que se documenta como temporal), dejando constancia de que ese caso queda condicionado hasta que el RF real exista. El RF actual NO se marca como terminado mientras tenga una dependencia pendiente de este tipo, aunque el resto de sus casos hayan pasado.

---

## SECCIÓN 2 — Verificar el comportamiento real contra cada caso

**DoR:** Sección 1 cerrada con DoD cumplido, Sección 1.5 cerrada (sin dependencias pendientes, o resueltas según el procedimiento anterior), y el código del RF ya está escrito (Guía 00, Parada 3 completada).

**Qué hago, para cada caso de prueba de la Sección 1:**
- Ejecuto (o simulo paso a paso, si no hay entorno de ejecución disponible en este momento) la condición de entrada exacta del caso.
- Comparo el resultado real contra el resultado esperado, incluyendo, si el RF especifica un mensaje textual, que el mensaje mostrado coincida con el especificado — no un mensaje "parecido" o "con el mismo sentido".
- Si el caso involucra una capa específica (base de datos, servidor, interfaz), confirmo que el comportamiento es correcto en esa capa concreta, no solo en el resultado final visible.

**DoD:**
- [ ] Cada caso de prueba de la Sección 1 tiene un resultado real registrado (pasó / falló, con el detalle de qué se observó).
- [ ] Para los casos que especifican un mensaje textual exacto, el mensaje real coincide carácter a carácter con el especificado en el RF — o se documenta explícitamente la diferencia si hay una razón de UX para variarlo, y se confirma esa variación con el usuario en vez de decidirla unilateralmente.
- [ ] Ningún caso quedó sin probar por considerarse "obvio que va a funcionar".

**Si el DoD falla (algún caso falló):** me detengo aquí. No marco el RF como terminado. Reporto el caso exacto que falló, contrastando: (a) lo que el RF pedía textualmente, (b) lo que el código hace actualmente, (c) qué parte del flujo (Guía 00) hay que revisar para corregirlo — y, si la corrección toca de nuevo el diseño de datos o de clases, se vuelve a pasar por la Guía 01 antes de tocar código otra vez, no se parchea directamente sobre el síntoma.

---

## SECCIÓN 3 — Verificar consistencia con el diseño (no solo con el resultado funcional)

**DoR:** Sección 2 cerrada con DoD cumplido (todos los casos de prueba pasaron).

**Por qué esta sección existe además de la Sección 2:** un código puede pasar todos los casos de prueba funcionales y, aun así, no respetar el diseño ya existente del proyecto — por ejemplo, lograr el resultado correcto reimplementando en JavaScript una regla que ya estaba garantizada por una constraint de PostgreSQL, lo cual "funciona" pero introduce una inconsistencia silenciosa que puede fallar más adelante (ver Guía 02, Árbol 3). Esta sección cierra ese hueco.

**Qué hago:**
- Confirmo que los nombres de tabla/columna usados en el código coinciden exactamente con los de la Guía 01, Sección 3.
- Confirmo que los métodos implementados usan las firmas exactas extraídas en la Guía 01, Sección 4.
- Confirmo, contra la Guía 01, Sección 2, que ninguna regla marcada como "de base de datos" fue reimplementada de forma redundante y descoordinada en el servidor.
- Confirmo, contra la Guía 02, que no quedó ninguna librería, capa o tabla nueva agregada sin haber pasado por su árbol de decisión correspondiente.

**DoD:**
- [ ] Nombres de tabla/columna: coinciden exactamente con el MER.
- [ ] Firmas de métodos: coinciden exactamente con el diagrama de clases.
- [ ] No hay duplicación descoordinada de reglas entre base de datos y servidor.
- [ ] No hay complejidad agregada (librería, capa, tabla) sin justificación según la Guía 02.

**Si el DoD falla:** me detengo. Esto no es un fallo funcional (los casos de la Sección 2 ya pasaron), pero sí es un fallo de cierre del RF — se corrige antes de marcar como terminado, porque la inconsistencia con el diseño es exactamente el tipo de problema que se vuelve más caro de corregir cuanto más tiempo pasa sin detectarlo.

---

## SECCIÓN 4 — Cierre del RF

**DoR:** Secciones 1 a 3 cerradas con DoD cumplido.

**DoD final:**
- [ ] Todos los casos de prueba de la Sección 1 pasaron en la Sección 2.
- [ ] La Sección 3 no encontró inconsistencias de diseño sin resolver.

**Si todo lo anterior se cumple:** el RF se marca como terminado y verificado. Esto es el final del flujo descrito en la Guía 00.

**Si algo no se cumple:** el RF permanece abierto. Se reporta al usuario el estado exacto (qué pasó, qué falta) — nunca se cierra un RF "parcialmente" sin decirlo explícitamente.
