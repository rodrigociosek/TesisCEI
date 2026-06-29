# GUÍA 04 — React
## Estándar de construcción del frontend, aplicado a este proyecto

---

## Qué es este documento y cómo se usa

Igual que la Guía 03, este documento se consulta cada vez que voy a tocar una pieza de frontend (un componente, un formulario, un estado, un efecto) dentro de la construcción de un RF — no se "cierra" una sola vez. Está organizado en bloques temáticos, cada uno con su DoR/DoD, y siguiendo la estructura qué-hacer / qué-NO-hacer / por-qué: la mayoría de los errores reales en React no son errores de sintaxis que el navegador rechace — son patrones que el código ejecuta sin queja visible, pero que producen bugs sutiles (datos desactualizados, renders de más, loops infinitos) que solo aparecen bajo ciertas condiciones. Cubrir solo "cómo se hace bien" deja a una IA sin defensa contra escribir, con buena fe, el patrón que se ve igual de razonable pero esconde el problema.

**Importante sobre vigencia:** confío en el contenido de este documento tal como está escrito, sin volver a verificarlo contra la documentación oficial en cada uso.

**Sobre el color:** esta guía no decide qué color usar en ningún componente — eso vive en `07_guia_sistema_color.md`. Cualquier `background-color`, `color`, o `border-color` que un componente necesite se toma de las variables CSS definidas ahí (`var(--color-primario)`, `var(--color-sobre-superficie)`, etc.), nunca de un valor hex elegido a criterio propio dentro de un archivo de componente o un estilo en línea.

**Regla de idioma:** los nombres de componentes, páginas, ganchos personalizados, servicios y funciones que representan conceptos del dominio van en español: `TarjetaProducto`, `FormularioRegistro`, `usePedidoActivo`, `servicios/productos.servicio.js`. Los hooks nativos de React y los identificadores técnicos estándar del lenguaje se quedan en inglés: `useState`, `useEffect`, `useReducer`, `props`, `children`.

## El estándar de referencia

La fuente principal de esta guía es la documentación oficial de React (`react.dev`), en particular "You Might Not Need an Effect", "Rules of Hooks", y la regla de lint `exhaustive-deps` del plugin oficial `eslint-plugin-react-hooks`. Para el criterio de qué herramienta de gestión de estado usar en cada caso, esta guía aplica el criterio de simplicidad (Guía 02): este proyecto NO incorpora librerías externas de estado (Redux, Zustand, TanStack Query, Jotai) salvo que, durante la construcción, se demuestre una necesidad concreta que `useState`, `useReducer` y `Context` nativos no puedan resolver razonablemente — aplicación directa de YAGNI.

---

## BLOQUE 1 — Estructura de carpetas

**Qué hacer:**
```
/src
  /componentes   → componentes de UI reutilizables (botones, tarjetas, formularios genéricos)
  /paginas       → componentes de página/vista, uno por ruta principal
  /ganchos       → hooks personalizados reutilizables (ej. useCarrito, useAuth)
  /servicios     → funciones que llaman a la API de Express (fetch/axios)
  /contexto      → Context API, solo para estado verdaderamente global (ej. sesión de usuario)
  App.jsx
```

**Qué NO hacer:** crear una carpeta nueva por cada componente pequeño "por organización", sin que el proyecto la necesite todavía. Un componente que solo se usa en una página vive junto a esa página o en `/componentes` si es genuinamente reutilizable.

**DoD:**
- [ ] Un componente que solo se usa en una página vive junto a esa página o en `/componentes` si es genuinamente reutilizable — no se crea una carpeta nueva por cada componente pequeño sin necesidad.

---

## BLOQUE 2 — Las Reglas de los Hooks (no negociables, fuente: react.dev)

**Por qué importa (bloque nuevo respecto a la versión anterior de esta guía):** React identifica cada Hook por el **orden** en que se llama durante el render, no por su nombre de variable. Esto significa que romper el orden de llamada entre un render y el siguiente corrompe el estado interno de React de forma silenciosa — sin un error claro en muchos casos, solo comportamiento incorrecto.

**Qué hacer:**
```javascript
// ✅ Todos los Hooks se llaman incondicionalmente, en el nivel superior del componente
function FichaProducto({ producto, mostrarDetalle }) {
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);

  if (!producto) return null; // el condicional va DESPUÉS de declarar los Hooks, no antes

  return /* ... */;
}
```

**Qué NO hacer — antipatrón 1, Hook dentro de un condicional:**
```javascript
// ❌ Esto rompe el orden de los Hooks entre renders
function FichaProducto({ producto, mostrarDetalle }) {
  if (mostrarDetalle) {
    const [detalle, setDetalle] = useState(null); // ¡Hook dentro de un if!
  }
  // ...
}
```
**Por qué esto falla:** si `mostrarDetalle` cambia entre `true` y `false` en distintos renders, React pierde la correspondencia entre cada Hook y su estado guardado — el resultado es estado mezclado entre Hooks distintos, no un error que se note de inmediato.

**Qué NO hacer — antipatrón 2, Hook dentro de un loop o llamado desde una función común:**
```javascript
// ❌ Hook llamado dentro de un map
function ListaProductos({ productos }) {
  return productos.map((p) => {
    const [cantidad, setCantidad] = useState(1); // ¡Hook dentro de un loop!
    return <Item key={p.id} cantidad={cantidad} />;
  });
}
```
**Por qué esto falla:** el número de Hooks llamados varía según cuántos elementos tenga `productos`, lo cual viola directamente la regla de orden estable. La solución correcta es mover el estado de cantidad a un componente `Item` separado, donde cada instancia tiene su propio `useState` en una posición estable.

**DoD:**
- [ ] Ningún Hook (`useState`, `useEffect`, `useReducer`, etc.) está dentro de un `if`, un loop, o una función anidada — todos se llaman incondicionalmente en el nivel superior del componente o de un Hook personalizado.
- [ ] Si necesito estado por cada elemento de una lista, ese estado vive en un componente separado para cada elemento, no en un Hook llamado dentro del `.map()`.

---

## BLOQUE 3 — Dónde vive cada estado (la decisión más importante de este bloque)

**Por qué importa:** la causa más común de complejidad innecesaria en React no es la sintaxis, es poner el estado en el lugar equivocado — demasiado global cuando podía ser local, o duplicado en vez de derivado.

**Regla de decisión (aplicar en este orden, deteniéndose en la primera que calce):**

1. **¿El valor se puede calcular a partir de otro estado o prop ya existente?** → No es estado nuevo. Se calcula directamente en el cuerpo del componente (ver Bloque 4).
2. **¿El valor solo importa dentro de un componente y nadie más lo necesita?** → `useState` local en ese componente.
3. **¿La lógica de ese estado tiene varias variables relacionadas que cambian juntas, o transiciones condicionadas por el valor anterior?** → `useReducer` en ese componente.
4. **¿Varios componentes lejanos entre sí (no padre-hijo directo) necesitan leer o cambiar el mismo valor, y ese valor cambia con poca frecuencia (ej. sesión de usuario, modo comprador/distribuidor activo — ver RF-013)?** → `Context`.
5. **¿El valor viene de la API de Express y se puede volver a pedir cuando se necesite, sin lógica especial de cache?** → se pide con `fetch`/`axios` (Bloque 6), guardado en `useState` local mientras se necesite en pantalla.

**Qué NO hacer:** duplicar en un `useState` un valor que ya se puede derivar de otro estado/prop. Esto crea dos fuentes de verdad que pueden desincronizarse — ver el antipatrón completo en el Bloque 4.

**No se usa en este proyecto, salvo necesidad demostrada:** Redux, Redux Toolkit, Zustand, Jotai, TanStack Query/React Query. Estas herramientas resuelven problemas de escala que este proyecto, según su propio diagrama de clases y MER, no presenta — introducirlas de entrada sería una violación directa del criterio de simplicidad (Guía 02).

**DoD:**
- [ ] Para cada estado nuevo que voy a crear, pasé por la regla de decisión de 1 a 5 y elegí la opción más simple que aplica.
- [ ] Ningún valor que se puede derivar de otro estado/prop está duplicado en un `useState` aparte.

---

## BLOQUE 4 — Cuándo usar (y cuándo NO usar) `useEffect`

**Por qué importa, citando directamente la razón que da la documentación oficial de React:** los Effects son una "vía de escape" del paradigma de React, pensada específicamente para sincronizar un componente con un **sistema externo** (el DOM del navegador, un WebSocket, un timer, la red). Si no hay un sistema externo involucrado, lo más probable es que no se necesite un Effect — y la propia documentación de React señala que los modelos de IA tienen una tendencia conocida a usar `useEffect` de más. Este bloque es, por esa razón, el punto de mayor atención de toda esta guía.

**Qué NO hacer — antipatrón 1, derivar estado con un Effect en vez de calcularlo:**
```javascript
// ❌ Estado y Effect innecesarios para algo que es puro cálculo
function ListaProductos({ productos, filtro }) {
  const [productosVisibles, setProductosVisibles] = useState([]);
  useEffect(() => {
    setProductosVisibles(productos.filter((p) => p.categoria === filtro));
  }, [productos, filtro]);
  // ...
}
```
**Por qué esto falla incluso cuando "funciona":** cada vez que `productos` o `filtro` cambian, React renderiza el componente, después corre el Effect, y el Effect dispara OTRO render con el valor actualizado — dos pasadas de render en vez de una, y una ventana breve donde la pantalla muestra datos desactualizados antes del segundo render.

**Qué hacer en su lugar:**
```javascript
// ✅ Cálculo directo en el cuerpo del componente
function ListaProductos({ productos, filtro }) {
  const productosVisibles = productos.filter((p) => p.categoria === filtro);
  // si el cálculo fuera costoso, se envuelve en useMemo, no en un Effect:
  // const productosVisibles = useMemo(() => productos.filter(...), [productos, filtro]);
}
```

**Qué NO hacer — antipatrón 2, lógica de un evento puesta en un Effect:**
```javascript
// ❌ Reaccionar a un cambio de estado causado por el propio evento, en vez de actuar en el evento
function FormularioPedido() {
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  useEffect(() => {
    if (pedidoConfirmado) {
      enviarNotificacionWhatsapp(); // ver RF de notificación, diagrama de clases
    }
  }, [pedidoConfirmado]);

  function handleConfirmar() {
    setPedidoConfirmado(true);
  }
}
```
**Por qué esto es más frágil que la alternativa:** si en algún punto el estado `pedidoConfirmado` se vuelve `true` por otra vía (por ejemplo, al cargar un pedido ya confirmado desde el servidor), el Effect se dispara igual y reenvía la notificación, aunque el usuario no haya hecho clic en nada. La lógica que solo debe correr cuando el usuario realiza una acción específica pertenece al manejador de esa acción, no a un Effect que observa el resultado.

**Qué hacer en su lugar:**
```javascript
// ✅ La acción y su consecuencia viven juntas, en el manejador del evento
function handleConfirmar() {
  setPedidoConfirmado(true);
  enviarNotificacionWhatsapp();
}
```

**Qué NO hacer — antipatrón 3, dependencias incompletas (stale closure):**
```javascript
// ❌ El Effect usa `cantidad` pero no la declara como dependencia
function ContadorCarrito({ cantidad }) {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('Cantidad actual:', cantidad); // siempre va a loguear el valor del primer render
    }, 5000);
    return () => clearInterval(id);
  }, []); // ❌ falta `cantidad` en el array de dependencias
}
```
**Por qué esto falla de forma confusa:** el Effect "captura" el valor de `cantidad` que existía en el momento en que el Effect se creó (la primera vez que el componente se renderizó), y como el array de dependencias está vacío, el Effect nunca se vuelve a crear — queda usando ese valor viejo para siempre, aunque `cantidad` cambie en pantalla. Esto se llama *stale closure* y es, según la documentación oficial y la comunidad de React, una de las fuentes de bugs más difíciles de diagnosticar porque el código no lanza ningún error.

**Qué hacer en su lugar:** declarar la dependencia real, o usar la forma funcional del setter de estado cuando solo se necesita el valor más reciente para calcular el siguiente:
```javascript
// ✅ Si de verdad se necesita leer `cantidad` dentro del Effect, se declara como dependencia
useEffect(() => {
  const id = setInterval(() => {
    console.log('Cantidad actual:', cantidad);
  }, 5000);
  return () => clearInterval(id);
}, [cantidad]); // el intervalo se recrea cada vez que cantidad cambia

// ✅ Si solo se necesita actualizar basándose en el valor anterior, usar la forma funcional
setCantidad((prev) => prev + 1); // no necesita `cantidad` en ningún array de dependencias
```

**Qué NO hacer — antipatrón 4, "silenciar" el linter de dependencias en vez de resolver el problema real:**
```javascript
// ❌ Desactivar la regla para que deje de "molestar"
useEffect(() => {
  cargarDatos(filtro);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```
**Por qué esto es peligroso:** la regla `exhaustive-deps` del plugin oficial de React existe específicamente para detectar stale closures antes de que lleguen a producción. Desactivarla no resuelve el problema de fondo — lo oculta. Si la dependencia real causa un loop infinito al agregarla, la señal correcta es que el Effect está mal diseñado (a menudo significa que ese valor no debería estar en el array de dependencias del Effect sino resuelto de otra forma, como con un `useRef` para valores que no deben re-disparar el efecto), no que el lint deba callarse.

**Casos que SÍ necesitan `useEffect` (uso legítimo):**
- Pedir datos a la API de Express cuando el componente se muestra en pantalla, con limpieza para evitar condiciones de carrera.
- Suscribirse a un evento del navegador (`window.addEventListener`), siempre con su función de limpieza.

**DoD:**
- [ ] Antes de escribir un `useEffect`, verifiqué que el motivo sea sincronizar con algo verdaderamente externo a React (red, DOM, timers, suscripciones) — si la respuesta es "solo quiero que esto se actualice cuando cambie tal estado", la solución correcta es calcular el valor directamente.
- [ ] Toda lógica que reacciona específicamente a una acción del usuario (clic, submit) vive en el manejador de ese evento, no en un Effect que observa el estado que ese evento cambió.
- [ ] El array de dependencias de cada `useEffect`/`useMemo`/`useCallback` incluye todos los valores externos que el cuerpo de la función usa — no se omite ninguno para "controlar" cuándo corre el efecto.
- [ ] No hay ningún `eslint-disable` de la regla `exhaustive-deps` en el código de este RF. Si el array de dependencias "no se puede resolver", el diseño del Effect se revisa, no se silencia el aviso.
- [ ] Todo `useEffect` que se queda escuchando algo (eventos, intervalos, suscripciones) tiene su función de limpieza (`return () => {...}`).

---

## BLOQUE 5 — No mutar el estado directamente

**Por qué importa (bloque nuevo):** React decide si debe volver a renderizar un componente comparando si la referencia del estado cambió. Si un array o un objeto de estado se modifica con métodos que cambian el original (`push`, `splice`, asignación directa de una propiedad), la referencia sigue siendo la misma — React no detecta el cambio y la pantalla no se actualiza, aunque el dato en memoria sí haya cambiado.

**Qué NO hacer:**
```javascript
// ❌ Mutación directa: la referencia del array no cambia
function Carrito() {
  const [items, setItems] = useState([]);
  function agregarProducto(producto) {
    items.push(producto);   // muta el array existente
    setItems(items);        // React ve la misma referencia: no vuelve a renderizar
  }
}
```

**Qué hacer en su lugar:**
```javascript
// ✅ Crear una copia nueva con el cambio aplicado
function agregarProducto(producto) {
  setItems((prev) => [...prev, producto]);
}

// ✅ Actualizar un objeto anidado sin mutar el original
setUsuario((prev) => ({ ...prev, nombreCompleto: nuevoNombre }));
```

**DoD:**
- [ ] Ninguna actualización de estado usa `push`, `pop`, `splice`, `sort` (sin copiar antes), ni asignación directa de una propiedad de un objeto de estado.
- [ ] Toda actualización de un array u objeto de estado crea una copia nueva (`[...prev, ...]`, `{...prev, campo: valor}`).

---

## BLOQUE 6 — Formularios

**Qué hacer:** este proyecto tiene formularios relativamente simples (registro, login, carga de producto, etc. — ver RF-009, RF-014). Para formularios de esta complejidad, `useState` por campo (o un solo `useState` con un objeto que agrupa los campos) es suficiente.

```javascript
function FormularioRegistro() {
  const [datos, setDatos] = useState({ telefono: '', contrasena: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value })); // copia, no mutación (Bloque 5)
  }
}
```

**Qué NO hacer:** introducir una librería de formularios (React Hook Form u otra) sin que un formulario concreto de este proyecto demuestre necesitarla — muchos campos con validaciones cruzadas complejas que `useState` simple no resuelve razonablemente (Guía 02, Árbol 1).

**DoD:**
- [ ] Los mensajes de error de validación mostrados en el formulario coinciden textualmente con los que especifica el RF correspondiente en su "Resultado esperado" (Guía 01, Sección 1).
- [ ] La validación de formato ocurre en el cliente para dar feedback inmediato, pero la fuente de verdad de la regla de negocio sigue siendo el servidor (Guía 03) — el frontend nunca es la única barrera de validación.
- [ ] Toda actualización de los datos del formulario respeta la regla de no-mutación del Bloque 5.

---

## BLOQUE 7 — Comunicación con la API de Express

**Qué hacer — forma estándar:**
```javascript
// servicios/productos.servicio.js (frontend)
const BASE_URL = '/api/productos';

export async function crearProducto(datos) {
  const respuesta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.error || 'Error al crear el producto.');
  }
  return respuesta.json();
}
```

**Qué NO hacer:**
```javascript
// ❌ Hacer fetch directamente dentro del cuerpo de un componente
function FormularioProducto() {
  async function handleSubmit() {
    const respuesta = await fetch('/api/productos', { method: 'POST', /* ... */ });
    // ...
  }
}
```
**Por qué conviene evitarlo:** mezclar la llamada HTTP directamente en el componente hace que la lógica de comunicación con el backend no se pueda reutilizar entre componentes ni probar de forma aislada — la misma razón de fondo que en Express separa controlador de servicio (Guía 03, Bloque 1).

**Qué NO hacer — ignorar el caso en que la petición falla:**
```javascript
// ❌ No verificar respuesta.ok antes de usar los datos
export async function crearProducto(datos) {
  const respuesta = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify(datos) });
  return respuesta.json(); // si el servidor respondió 400/500, esto devuelve el cuerpo del error como si fuera éxito
}
```
**Por qué esto falla:** `fetch` no lanza una excepción cuando el servidor responde con un código de error HTTP (4xx, 5xx) — solo lanza excepción si la red falla. Sin la verificación de `respuesta.ok`, el código que llama a esta función trata una respuesta de error como si fuera un éxito.

**DoD:**
- [ ] Las funciones que llaman a la API viven en `/servicios`, separadas de los componentes — un componente nunca hace `fetch` directamente en su cuerpo.
- [ ] Toda función de servicio verifica `respuesta.ok` antes de devolver los datos, y lanza un error legible si la respuesta no fue exitosa.
- [ ] Los nombres de los campos enviados/recibidos están en camelCase, consistentes con la traducción fijada en la Guía 01, Sección 3.
