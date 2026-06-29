# CLAUDE.md
## Contexto obligatorio para Claude Code en este repositorio

---

## Qué es este archivo y por qué Claude Code lo lee solo

Este archivo vive en la raíz del repositorio porque Claude Code lo busca y lo lee automáticamente al iniciar sesión en esta carpeta, sin que nadie tenga que pedirlo. Su trabajo no es explicar cómo programar — es decir **dónde está el contexto real del proyecto** y **en qué orden consultarlo**, antes de tocar una sola línea de código.

Este archivo NO repite el contenido de las guías. Repetirlo crearía el mismo riesgo que ya se evitó dentro del propio sistema de guías: dos lugares con la misma información, que con el tiempo pueden quedar desincronizados. Este archivo apunta, no explica.

---

## Regla número uno, sin excepción

**Antes de generar o modificar código para cualquier requerimiento funcional (RF) de este proyecto, leer `/docs/guias/00_guia_general_orquestadora.md` completo.**

Ese archivo es el mapa: dice en qué orden leer las demás guías y cuándo pasar de una a la siguiente. No saltarlo, no resumirlo de memoria, no asumir que "ya se sabe" lo que dice porque se leyó en una sesión anterior — leerlo de nuevo al empezar cada RF nuevo, porque puede haber sido corregido desde la última vez.

---

## Dónde está cada cosa

```
/docs/guias/
  00_guia_general_orquestadora.md   ← EMPEZAR SIEMPRE ACÁ. Es el mapa de navegación.
  01_guia_analisis_proyecto.md      ← Cómo leer el RF, el MER y el diagrama de clases.
  02_guia_criterio_simplicidad.md   ← Qué cuenta como "simple" en este proyecto, antes de codear.
  03_guia_expressjs.md              ← Reglas y antipatrones de Express, con código.
  04_guia_react.md                  ← Reglas y antipatrones de React, con código.
  05_guia_postgresql.md             ← Reglas y antipatrones de PostgreSQL, con código.
  06_guia_verificacion.md           ← Cómo probar que el RF construido cumple lo pedido.
```

Estos documentos del proyecto son la fuente de verdad del dominio — no son guías de comportamiento, son lo que las guías consultan:

```
/docs/proyecto/
  seccion_1_8_lista_requerimientos.md     ← Texto oficial de cada RF y RNF.
  seccion_1_8_casos_de_uso.md             ← Cursos Normal y Alterno por caso de uso.
  bd_vs_programacion_distribuidora.md     ← Qué regla va en la base, qué regla va en el servidor.
  mer_distribuidora.md                    ← Modelo de datos en DBML — nombres reales de tablas/columnas.
  diagrama_codigo_completo.md             ← Diagrama de clases — métodos y firmas reales a implementar.
```

> Si estas dos carpetas no existen todavía en el repositorio, crearlas con esta estructura antes de empezar a trabajar en el primer RF — son la base de todo lo demás.

---

## Estructura del repositorio (verificar y ajustar — ver advertencia al inicio)

```
/backend     ← Express + PostgreSQL. Sigue 03_guia_expressjs.md y 05_guia_postgresql.md.
/frontend    ← React. Sigue 04_guia_react.md.
/docs        ← Guías y documentos del proyecto (ver arriba).
```

---

## Regla de comportamiento, resumida (el detalle completo vive en cada guía)

- No se escribe código sin haber pasado primero por `01_guia_analisis_proyecto.md` para el RF específico que se está construyendo — esa guía tiene su propio checklist de "listo para empezar" y "terminado", y si no se cumple, el flujo se detiene y se reporta qué falta en vez de avanzar a ciegas.
- No se agrega una librería, una capa, o una tabla nueva sin pasar primero por los árboles de decisión de `02_guia_criterio_simplicidad.md`. El default siempre es la opción simple.
- Los nombres de tablas, columnas y métodos usados en el código tienen que coincidir exactamente con los del MER y el diagrama de clases (Sección 3 y 4 de `01_guia_analisis_proyecto.md`) — nunca un nombre "parecido" o "más claro" a criterio propio.
- Ningún RF se marca como terminado sin haber pasado por `06_guia_verificacion.md` completa, usando el "Resultado esperado" y el Curso Alterno del RF como casos de prueba reales.
- Si en algún punto falta información (un RF no aparece en un documento, una tabla no existe en el MER, un método no está en el diagrama de clases), la regla es **detenerse y preguntar**, nunca inventar el contenido faltante por cuenta propia.

---

## Si este archivo y una guía dicen cosas distintas

Las guías en `/docs/guias` son la fuente de verdad sobre el detalle de comportamiento. Este archivo (`CLAUDE.md`) es solo el índice de entrada. Si hay una diferencia entre lo que dice este archivo y lo que dice una guía, gana la guía — y esa diferencia debería reportarse como una inconsistencia a corregir en este archivo, no resolverse en silencio eligiendo una de las dos versiones.
