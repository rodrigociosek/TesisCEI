# GUÍA 07 — Sistema de Color
## Estándar de construcción de la paleta visual, aplicado a este proyecto

---

## Qué es este documento y por qué existe

Este documento define cómo se construyen, nombran y usan los colores de la interfaz de este proyecto: el color primario, el color secundario, sus derivados, y cómo el negro y el blanco se integran al mismo sistema en vez de vivir aparte como valores sueltos.

La razón de que esto necesite un estándar y no una elección de gusto es la misma razón de fondo que ya rige el resto de este sistema de guías: si cada componente nuevo elige su propio tono de gris o su propio "azul un poco más oscuro" a ojo, el proyecto termina con docenas de valores de color casi iguales pero no idénticos, sin ninguna relación matemática entre ellos — exactamente el tipo de inconsistencia silenciosa que ya identificamos como riesgo en otras partes de este sistema (nomenclatura de tablas, firmas de métodos). Un sistema de color con reglas explícitas evita esto desde el origen.

## El estándar de referencia

La fuente de este documento es **Material Design 3** (`m3.material.io`), específicamente su sistema de color basado en el espacio **HCT (Hue, Chroma, Tone)** — Hue (matiz: el color en sí, ej. azul vs. rojo), Chroma (qué tan vívido o gris es ese color), Tone (qué tan claro u oscuro es, de 0=negro a 100=blanco). Este es el mismo sistema que usan Android, Google Workspace, y cientos de productos en producción; no es una propuesta nueva ni una interpretación de diseño — es una especificación pública con una librería de código abierto (`@material/material-color-utilities`) que implementa los cálculos exactos.

**Por qué este estándar resuelve exactamente el pedido de este proyecto:** HCT no trata "negro", "blanco" y "los colores principales" como cosas separadas. Trata TODO como tonos derivados de un mismo matiz (`hue`), con distinta cantidad de color (`chroma`). El rol que produce los grises, blancos y negros de la interfaz — llamado **neutral** — se calcula tomando el mismo `hue` que el color primario, pero con `chroma` muy bajo (4, sobre una escala donde 0 es gris puro). Eso es, literalmente, "negro y blanco con un poco del color principal" — no una metáfora, es el cálculo real que define el estándar.

---

## Estado actual de este proyecto: modo placeholder en escala de grises

Este proyecto todavía no tiene definido el color primario ni el secundario — los wireframes existentes son en blanco y negro, y la elección de color queda para más adelante. Esto **no es un obstáculo** para aplicar el sistema ya: se construye toda la estructura con `chroma = 0` (gris puro, sin matiz) en los roles de acento, y la paleta queda funcionando hoy mismo en blanco y negro, sin que haya que rediseñar nada el día que se elijan los colores reales — ver la sección "Qué cambiar cuando se elijan los colores reales", al final de este documento, que describe el único paso necesario.

---

## La tabla de roles (fuente de verdad de este documento)

> **Nota de validación:** esta tabla fue verificada contra el wireframe HTML real del proyecto (`Wireframes — Marketplace Mayorista`). Se midieron programáticamente los 22 valores de gris distintos usados en sus 3.917 líneas, y los 22 coinciden con `chroma = 0` exacto (R=G=B en cada uno, sin ninguna excepción) — confirmando que el enfoque de esta guía es el correcto. La tabla original solo cubría 14 roles; se amplía aquí con los roles de **superficie en capas** (`surface-container-*`) que Material 3 ya define para exactamente este caso — un proyecto que necesita más de 2-3 escalones de gris para distinguir paneles, tarjetas y fondos superpuestos — porque el wireframe real usa esos escalones intermedios de forma consistente.

| Rol | Hue | Chroma | Tono (tema claro) | Tono (tema oscuro) | Tono real visto en el wireframe |
|---|---|---|---|---|---|
| `primary` | 0 | 0 | 40 | 80 | — (no definido aún, ver estado del proyecto) |
| `on-primary` | 0 | 0 | 100 | 20 | — |
| `primary-container` | 0 | 0 | 90 | 30 | — |
| `on-primary-container` | 0 | 0 | 10 | 90 | — |
| `secondary` | 0 | 0 | 40 | 80 | — |
| `on-secondary` | 0 | 0 | 100 | 20 | — |
| `secondary-container` | 0 | 0 | 90 | 30 | — |
| `on-secondary-container` | 0 | 0 | 10 | 90 | — |
| `surface` (fondo general — "blanco") | 0 | 4 | 99 | 10 | `#FAFAFA` (98), `#F8F8F8` (97) |
| `on-surface` (texto sobre `surface` — "negro") | 0 | 4 | 10 | 90 | `#1A1A1A` (10) |
| `surface-dim` (fondo levemente oscurecido) | 0 | 4 | 87 | 6 | `#0D0D0D` (5), `#0F0F0F` (6) |
| `surface-bright` (fondo más claro que `surface`) | 0 | 4 | 98 | 24 | `#FAFAFA` (98) |
| `surface-container-lowest` | 0 | 4 | 100 | 4 | — |
| `surface-container-low` | 0 | 4 | 96 | 10 | `#F5F5F5` / `#F4F4F4` (96) |
| `surface-container` (paneles, tarjetas) | 0 | 4 | 94 | 12 | `#F0F0F0` (94), `#1E1E1E` (12) |
| `surface-container-high` | 0 | 4 | 92 | 17 | `#E8E8E8` (91), `#2A2A2A`/`#2E2E2E` (16-18) |
| `surface-container-highest` | 0 | 4 | 90 | 22 | `#E6E6E6`/`#E4E4E4` (89-90), `#383838` (22) |
| `surface-variant` | 0 | 4 | 90 | 30 | `#E0E0E0` (88) |
| `on-surface-variant` | 0 | 4 | 30 | 80 | `#888` / `#999` (texto de etiquetas, valor aproximado) |
| `outline` (bordes, divisores) | 0 | 8 | 50 | 60 | `#C8C8C8`/`#C0C0C0`/`#C4C4C4` (75-78) |
| `outline-variant` | 0 | 8 | 80 | 30 | `#D8D8D8`/`#D4D4D4` (83-85) |

**Cómo leer esta tabla:** cada fila no es un color fijo — es una fórmula. El `Tono` define qué tan claro u oscuro es (0=negro absoluto, 100=blanco absoluto). El `Chroma` define cuánto del `Hue` (matiz) se mezcla en ese gris. Mientras `Hue` y `Chroma` sean 0 en los roles de acento (`primary`, `secondary`), esos roles se ven como grises neutros, distinguibles entre sí por su `Tono` pero sin ningún matiz de color — que es exactamente el estado correcto para un proyecto que todavía trabaja en blanco y negro.

**Por qué los roles `surface-container-*` importan para este proyecto en particular:** el wireframe real distingue visualmente varios niveles de "capas" sobre el fondo — la barra superior, el panel de filtros, las tarjetas de producto, el fondo del área de contenido — cada uno con un gris ligeramente distinto del de al lado, para que el usuario perciba la jerarquía sin necesidad de bordes marcados en todos lados. Los 5 roles `surface-container-*` son la forma estándar de Material 3 de nombrar exactamente esa progresión, en vez de inventar nombres de variable nuevos para cada capa que un componente futuro necesite.

---

## BLOQUE 1 — Variables CSS (cómo se materializa la tabla en código)

**Qué hacer:** declarar todas las variables en un único archivo, `frontend/src/styles/colors.css`, usando los valores ya resueltos de la tabla anterior — los componentes nunca calculan ni declaran un color por su cuenta, solo consumen estas variables por nombre de rol.

```css
/* frontend/src/styles/colors.css */
:root {
  /* === Tema claro (default) === */
  --color-primary: #6b6b6b;              /* tono 40, chroma 0 */
  --color-on-primary: #ffffff;            /* tono 100, chroma 0 */
  --color-primary-container: #e1e1e1;     /* tono 90, chroma 0 */
  --color-on-primary-container: #1a1a1a;  /* tono 10, chroma 0 */

  --color-secondary: #6b6b6b;             /* tono 40, chroma 0 */
  --color-on-secondary: #ffffff;          /* tono 100, chroma 0 */
  --color-secondary-container: #e1e1e1;   /* tono 90, chroma 0 */
  --color-on-secondary-container: #1a1a1a;/* tono 10, chroma 0 */

  --color-surface: #fdfdfd;               /* tono 99, chroma 4 → "blanco" */
  --color-on-surface: #1c1c1c;            /* tono 10, chroma 4 → "negro" */
  --color-surface-dim: #dedede;           /* tono 87, chroma 4 */
  --color-surface-bright: #fafafa;        /* tono 98, chroma 4 — valor real del wireframe */
  --color-surface-container-lowest: #ffffff; /* tono 100, chroma 4 */
  --color-surface-container-low: #f5f5f5;    /* tono 96, chroma 4 — valor real del wireframe */
  --color-surface-container: #f0f0f0;        /* tono 94, chroma 4 — valor real del wireframe */
  --color-surface-container-high: #e8e8e8;   /* tono 92, chroma 4 — valor real del wireframe */
  --color-surface-container-highest: #e6e6e6;/* tono 90, chroma 4 — valor real del wireframe */
  --color-surface-variant: #e0e0e0;          /* tono 88, chroma 4 — valor real del wireframe */
  --color-on-surface-variant: #888888;       /* aprox. tono 53, usado en etiquetas del wireframe */

  --color-outline: #c4c4c4;               /* tono ~77, chroma 8 — valor real del wireframe */
  --color-outline-variant: #d8d8d8;       /* tono ~85, chroma 8 — valor real del wireframe */
}

[data-theme="dark"] {
  /* === Tema oscuro === */
  --color-primary: #cccccc;               /* tono 80, chroma 0 */
  --color-on-primary: #333333;            /* tono 20, chroma 0 */
  --color-primary-container: #4d4d4d;     /* tono 30, chroma 0 */
  --color-on-primary-container: #e6e6e6;  /* tono 90, chroma 0 */

  --color-secondary: #cccccc;
  --color-on-secondary: #333333;
  --color-secondary-container: #4d4d4d;
  --color-on-secondary-container: #e6e6e6;

  --color-surface: #1a1a1a;               /* tono 10, chroma 4 → "negro" en oscuro */
  --color-on-surface: #e6e6e6;            /* tono 90, chroma 4 → "blanco" en oscuro */
  --color-surface-dim: #0f0f0f;           /* tono 6, chroma 4 — valor real del wireframe */
  --color-surface-bright: #383838;        /* tono ~22, chroma 4 */
  --color-surface-container-lowest: #0d0d0d; /* tono 5, chroma 4 — valor real del wireframe */
  --color-surface-container-low: #1a1a1a;
  --color-surface-container: #1e1e1e;         /* tono 12, chroma 4 — valor real del wireframe */
  --color-surface-container-high: #2a2a2a;    /* tono 16, chroma 4 — valor real del wireframe */
  --color-surface-container-highest: #2e2e2e; /* tono 18, chroma 4 — valor real del wireframe */
  --color-surface-variant: #4d4d4d;
  --color-on-surface-variant: #c9c9c9;

  --color-outline: #919191;
  --color-outline-variant: #4d4d4d;
}
```

**Qué NO hacer:**
```css
/* ❌ Un componente declara su propio gris "a ojo", sin pasar por la variable de rol */
.boton-secundario {
  background-color: #707070; /* ¿de dónde sale este valor? no está en la tabla de roles */
}
```
**Por qué esto rompe el sistema:** ese gris no tiene ninguna relación matemática con el resto de la paleta — no se sabe si es más claro o más oscuro que `secondary-container` sin medirlo a mano, y el día que se cambie el color base de toda la app, este valor queda huérfano, sin actualizarse, mientras todo lo demás sí cambia.

**Qué NO hacer — variante más sutil:**
```css
/* ❌ Usar la variable de un rol para algo que semánticamente es otro rol */
.tarjeta-producto {
  background-color: var(--color-primary); /* el fondo de una tarjeta no es una acción primaria */
}
```
**Por qué esto es un error aunque "funcione" visualmente:** `primary` está reservado, según el propio estándar, para los elementos de mayor énfasis (botones de acción principal, FAB) — no para fondos de contenido general. Usarlo en una tarjeta hace que esa tarjeta compita visualmente con los botones de acción real, confundiendo al usuario sobre qué es interactivo y qué es solo contenido. El rol correcto para el fondo de una tarjeta es `surface` o `surface-variant`.

**Qué hacer — cómo elegir entre los 5 niveles de `surface-container`:** la regla de Material 3 es de afuera hacia adentro, de más bajo a más alto énfasis: el fondo general de la pantalla usa `surface` o `surface-container-lowest`; el siguiente nivel de panel (una barra lateral, un panel de filtros — como el panel de filtros real del wireframe de este proyecto) usa `surface-container-low`; una tarjeta o panel de contenido normal usa `surface-container`; un panel que necesita distinguirse más (una tarjeta seleccionada, un dropdown abierto) usa `surface-container-high`; y el nivel más alto (`surface-container-highest`) se reserva para elementos que deben distinguirse incluso de otros paneles ya elevados (un modal sobre un panel, por ejemplo — como las cajas de trazabilidad "CU relacionados" del propio wireframe, que usan el tono más alto del documento para separarse claramente del resto del contenido). No se salta de `surface` directo a `surface-container-highest` sin pasar por los niveles intermedios cuando hay más de dos capas visuales en la misma pantalla — saltarse niveles es lo que hace que la jerarquía visual deje de percibirse.

**Qué NO hacer:**
```css
/* ❌ Usar surface-container-highest para todo lo que "necesita destacar un poco" */
.panel-filtros { background-color: var(--color-surface-container-highest); }
.tarjeta-producto { background-color: var(--color-surface-container-highest); }
.modal-confirmacion { background-color: var(--color-surface-container-highest); }
```
**Por qué esto falla:** si todos los niveles de la interfaz usan el mismo tono, no hay jerarquía — un modal que debería sentirse "por encima" de todo se ve exactamente igual de plano que una tarjeta de producto. La progresión de 5 niveles existe específicamente para que cada capa visual tenga un escalón de gris distinto y perceptible del de la capa debajo.

**DoD:**
- [ ] Todas las variables de color están declaradas una sola vez, en `frontend/src/styles/colors.css`.
- [ ] Ningún archivo de componente declara un valor de color (hex, rgb) directamente — todos consumen `var(--color-rol)`.

---

## BLOQUE 2 — La regla de los pares "on-" (contraste garantizado)

**Por qué importa:** el estándar empareja cada color de fondo con su color de texto correspondiente (`primary` con `on-primary`, `surface` con `on-surface`, etc.) precisamente porque la diferencia de Tono entre ambos ya fue calculada para cumplir un contraste mínimo accesible (la documentación oficial cita 3:1 como mínimo estándar, y hasta 7:1 en modos de alto contraste). Romper el par es la forma más común y menos visible de introducir un problema de accesibilidad.

**Qué hacer:**
```css
/* ✅ Cada fondo usa su "on-" correspondiente para el texto */
.boton-primario {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}
```

**Qué NO hacer:**
```css
/* ❌ Texto negro fijo, sin importar el fondo */
.boton-primario {
  background-color: var(--color-primary);
  color: #000000; /* ¿y si el tema oscuro hace que --color-primary también sea oscuro? */
}
```
**Por qué esto falla en un caso real de este proyecto:** en el tema oscuro de la tabla anterior, `primary` tiene tono 80 (claro). Si el texto está fijado en negro puro sin usar `on-primary`, "casualmente" funciona en ese caso — pero la próxima persona que cambie el tono de `primary` para otro propósito no tiene ninguna garantía de que el negro fijo siga siendo legible. La variable `on-primary` existe exactamente para que ese cálculo nunca dependa de una suposición.

**DoD:**
- [ ] Cada vez que se usa `var(--color-X)` como fondo, el texto/ícono sobre ese fondo usa `var(--color-on-X)` — nunca un valor de color fijo.

---

## BLOQUE 3 — Modo oscuro (no es un archivo aparte, es el mismo sistema invertido)

**Por qué importa:** en HCT, el tema oscuro no es una paleta distinta diseñada por separado — es la misma tabla de roles, con los tonos claros y oscuros intercambiados (ver la columna "Tono (tema oscuro)" de la tabla principal). Tratarlo como un sistema aparte duplica el trabajo y el riesgo de inconsistencia.

**Qué hacer:** seguir exactamente la estructura ya mostrada en el Bloque 1 — un único archivo `colors.css`, con el bloque `:root` para el tema claro y el bloque `[data-theme="dark"]` para el oscuro, usando los mismos nombres de variable en ambos. El componente nunca sabe ni le importa en qué tema está — solo consume `var(--color-primary)`, y el valor correcto se resuelve solo según el atributo `data-theme` del documento.

**Qué NO hacer:**
```css
/* ❌ Variables con nombres distintos para cada tema */
:root {
  --color-primary-light: #6b6b6b;
  --color-primary-dark: #cccccc;
}
```
**Por qué esto es peor:** obliga a cada componente a saber en qué tema está y elegir la variable correcta a mano (`var(--color-primary-light)` vs `var(--color-primary-dark)`), reintroduciendo manualmente el problema que el atributo `data-theme` ya resuelve automáticamente.

**DoD:**
- [ ] Existe un único nombre de variable por rol (`--color-primary`), nunca un nombre distinto por tema.
- [ ] El cambio de tema se controla con un solo atributo (`data-theme` en el elemento raíz), no con clases distintas por componente.

---

## BLOQUE 4 — Qué cambiar cuando se elijan los colores reales (el único paso necesario)

Cuando el proyecto decida el color primario y secundario reales, el cambio se limita a **recalcular los valores hex de la tabla**, reemplazando `Chroma = 0` (y `Hue = 0`) por el `Hue` y `Chroma` reales del color elegido, usando la misma fórmula de tonos que ya está fijada en este documento (40/80/90/30/10/90/100/20 para los roles de acento; 99/10/90/30 con chroma 4 para los roles neutros).

**Qué hacer:** generar los nuevos valores hex con la librería oficial `@material/material-color-utilities` (o el Material Theme Builder, su versión visual) a partir del color primario elegido, y reemplazar únicamente los valores dentro de `colors.css` — los nombres de variable, su estructura, y cada componente que ya las consume quedan exactamente iguales.

**Qué NO hacer:** no reescribir los nombres de variable, no tocar ningún archivo de componente, y no "ajustar a ojo" los nuevos valores de color sin pasar por el cálculo HCT — eso reintroduce el mismo riesgo de inconsistencia que este documento existe para evitar.

**DoD (a ejecutar el día que esto ocurra):**
- [ ] El color primario y secundario reales se pasaron por el cálculo HCT (librería o Material Theme Builder), no se eligieron a ojo sus tonos derivados.
- [ ] Solo se modificaron los valores hex dentro de `colors.css` — ningún nombre de variable ni archivo de componente cambió.

---

## Regla de idioma para las variables CSS

Las variables CSS de color de este proyecto se nombran en español: `--color-primario`, `--color-superficie`, `--color-contorno`. El selector de tema oscuro es `[data-tema="oscuro"]`. Ninguna variable CSS de este archivo usa nombres en inglés de Material 3: `--color-primary`, `--color-surface` y `[data-theme="dark"]` están prohibidos — la tabla de traducción completa (Material 3 inglés → español) está en el Bloque de variables CSS de esta misma guía. La regla es simple: si el proyecto tiene libertad de nombrar algo, va en español.

## Resumen de integración con el resto del sistema de guías

- Esta guía es consultada por `04_guia_react.md` cada vez que un componente nuevo necesita color — la Guía 04 no decide qué color usar, remite aquí.
- Esta guía no decide la estructura visual de ninguna pantalla (eso lo decide el wireframe, ver `01_guia_analisis_proyecto.md`) — decide únicamente de dónde sale cada color que esa estructura visual necesite.
- Aplica el mismo criterio de simplicidad del resto del sistema (`02_guia_criterio_simplicidad.md`): no se agregan roles de color nuevos a la tabla principal sin que un componente real los necesite — los 14 roles de esta guía cubren la enorme mayoría de los casos de una interfaz como la de este proyecto.
