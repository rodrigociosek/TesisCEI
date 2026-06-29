# GUÍA GENERAL — Mapa de navegación entre documentos
## Proyecto: Marketplace Mayorista (React + Express + PostgreSQL)

---

## Qué es este documento y qué NO es

Este documento responde una sola pregunta: **dado un requerimiento funcional (RF) para construir, en qué orden leo los documentos disponibles, y cuándo paso de uno al siguiente.**

Este documento no explica cómo leer cada documento a fondo (eso vive en `01_guia_analisis_proyecto.md`), no explica las prácticas técnicas de cada framework (eso vive en `03_guia_expressjs.md`, `04_guia_react.md`, `05_guia_postgresql.md`), y no explica cómo verificar el resultado final (eso vive en `06_guia_verificacion.md`). Este documento es deliberadamente corto: es un mapa, no el territorio. Si necesito perderme en detalle para entender un paso, esa es la señal de que debo saltar al documento correspondiente — no de que este documento esté incompleto.

## Por qué este documento existe separado de los demás

Cuando una secuencia de pasos y el detalle de cada paso viven en el mismo archivo largo, el riesgo es perder de vista el orden global mientras se está inmerso en el detalle de un solo paso. Separar "en qué orden" de "cómo a fondo" es la misma razón por la que, en Express (ver guía 03), un controlador debe quedar delgado y delegar el trabajo real a una capa de servicio: cada parte hace una sola cosa, y es más fácil verificar que el orden se respetó si el documento que define el orden no se diluye entre explicaciones largas.

## Regla de comportamiento: PARADA DURA EN CADA PARADA DEL MAPA

Igual que el resto de las guías de este proyecto, no avanzo a la siguiente parada del mapa sin que la parada actual reporte su trabajo como cerrado (DoD cumplido, según se define en el documento correspondiente a esa parada). Esta guía no repite esos DoD — los referencia. El DoD detallado de cada parada vive en el documento que le corresponde.

---

## EL MAPA

```
 INICIO: el usuario pide construir un RF (por ID o por descripción)
   │
   ▼
 PARADA 1 ── Ejecutar 01_guia_analisis_proyecto.md (completa)
   │         Ahí se localiza el RF, se clasifica BD/programación,
   │         se extrae el MER y se extrae el diagrama de clases.
   │         Esa guía tiene su propio DoR/DoD por sección interna.
   │
   │   [DoD de la guía 01 no cumplido] ──→ DETENER. No continuar
   │                                       a la Parada 2 bajo ninguna
   │                                       circunstancia.
   ▼
 PARADA 2 ── Determinar qué guías técnicas invocar
   │         Regla de invocación (basada en lo que la Parada 1
   │         determinó que el RF toca):
   │
   │         ¿Toca tabla/columna/constraint/consulta?
   │            → invocar 05_guia_postgresql.md
   │         ¿Toca ruta/controlador/middleware/lógica de servidor?
   │            → invocar 03_guia_expressjs.md
   │         ¿Toca componente/vista/formulario/estado de interfaz?
   │            → invocar 04_guia_react.md
   │
   │         Si toca más de una capa (caso más común en este
   │         proyecto), invocar todas las que correspondan,
   │         EN ESTE ORDEN: PostgreSQL → Express → React.
   │         (De adentro hacia afuera: primero la base, luego
   │         quien la consume, luego quien la muestra.)
   │
   │   [no puedo determinar qué capas toca] ──→ DETENER, volver
   │                                            a revisar la
   │                                            clasificación
   │                                            BD/programación
   │                                            de la Parada 1.
   ▼
 PARADA 3 ── Codear, consultando 02_guia_criterio_simplicidad.md
   │         ANTES de escribir cada pieza nueva (cada tabla, cada
   │         librería, cada capa) — no como una referencia de
   │         fondo durante la implementación. Esa guía es
   │         explícita en que un chequeo de simplicidad hecho
   │         "mientras" o "después" de escribir el código ya
   │         llega tarde: el sobre-diseño que busca evitar ya
   │         habría ocurrido. Se consulta ANTES de cada decisión
   │         de diseño nueva, una por una.
   │
   │   [el código no usa los nombres/firmas exactos que la
   │    Parada 1 extrajo] ──→ DETENER, corregir antes de seguir.
   ▼
 PARADA 4 ── Ejecutar 06_guia_verificacion.md (completa)
   │         Usa el "Resultado esperado" y los Cursos Alternos
   │         extraídos en la Parada 1 como checklist de prueba.
   │
   │   [DoD de la guía 06 no cumplido] ──→ NO marcar el RF como
   │                                       terminado. Volver a la
   │                                       parada que corresponda
   │                                       corregir.
   ▼
 FIN: RF terminado y verificado
```

## Tabla de referencia rápida — qué documento abrir según la pregunta

| Si la pregunta en este momento es... | El documento a abrir es... |
|---|---|
| "¿Qué pide exactamente este RF?" | `01_guia_analisis_proyecto.md` |
| "¿Esta regla va en la base de datos o en el servidor?" | `01_guia_analisis_proyecto.md` |
| "¿Cómo se llama esta tabla/columna en el MER?" | `01_guia_analisis_proyecto.md` |
| "¿Qué método ya existe para esta clase de dominio?" | `01_guia_analisis_proyecto.md` |
| "¿Esto que estoy a punto de programar es demasiado complejo?" | `02_guia_criterio_simplicidad.md` |
| "¿Cómo se estructura una ruta/controlador en Express, hoy?" | `03_guia_expressjs.md` |
| "¿Cómo se estructura un componente/estado en React, hoy?" | `04_guia_react.md` |
| "¿Cómo se escribe una consulta/transacción en PostgreSQL, hoy?" | `05_guia_postgresql.md` |
| "¿Cómo confirmo que lo que construí cumple lo que el RF pedía?" | `06_guia_verificacion.md` |

## Documentos del proyecto que las guías técnicas consultan (no son guías, son fuente de verdad del dominio)

- `seccion_1_8_lista_requerimientos.md` — texto oficial de cada RF y RNF.
- `seccion_1_8_casos_de_uso.md` — Cursos Normal y Alterno por caso de uso.
- `bd_vs_programacion_distribuidora.md` — clasificación BD vs. programación por RF.
- `mer_distribuidora.md` — modelo de datos en DBML (PostgreSQL).
- `diagrama_codigo_completo.md` — diagrama de clases de dominio (Mermaid).
