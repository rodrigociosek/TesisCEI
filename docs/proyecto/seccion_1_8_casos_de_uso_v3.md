# SECCIÓN 1.8 — ESPECIFICACIÓN DE CASOS DE USO
## Proyecto AP-ATI · Universidad ORT Uruguay

---

## 1.1 Diagrama de casos de uso (UML)

> **Nota de entrega:** El diagrama UML formal debe generarse con herramienta de modelado (Lucidchart, draw.io, StarUML o equivalente) utilizando los elementos definidos a continuación. El diagrama representa al sistema como caja negra, muestra todos los actores y sus relaciones con los casos de uso, e incluye las relaciones «include» y «extend» donde corresponde.

**Actores del sistema:**

| Actor | Tipo | Descripción |
|---|---|---|
| Usuario no autenticado | Primario | Persona que accede al sistema sin sesión activa. Puede navegar el catálogo y consultar perfiles públicos. |
| Comprador autenticado | Primario | Usuario con sesión activa en modo comprador. Puede operar el carrito, confirmar pedidos y gestionar su historial. Toda cuenta nace en modo comprador; el modo distribuidor se activa opcionalmente desde esta cuenta (RF-012). |
| Distribuidor | Primario | Comprador autenticado que activó el modo distribuidor en su cuenta (RF-012) y configuró su perfil inicial (RF-052). Tiene acceso completo e irrestricto a todas las funciones del panel del distribuidor, independientemente del sistema de roles de empleados. |
| Usuario con modo dual | Primario | Usuario que tiene habilitados simultáneamente el modo comprador y el modo distribuidor, y puede alternar entre ellos. Es una especialización que hereda los UCs de Comprador autenticado y Distribuidor. |
| Empleado | Primario | Persona creada por el administrador del distribuidor para operar el panel con un rol fijo asignado. Accede mediante cédula de identidad y contraseña. Los roles disponibles son: Administrador (acceso completo al panel, incluida la gestión de empleados y la configuración del negocio) y Operador (gestión de pedidos y stock, sin acceso a configuración del negocio ni a gestión de empleados). El rol se asigna al crear la cuenta y determina de forma fija las funciones accesibles. |

**Relaciones de generalización de actores:**
- Comprador autenticado → hereda de → Usuario no autenticado (para UCs de navegación pública)
- Usuario con modo dual → hereda de → Comprador autenticado y Distribuidor
- Empleado → no hereda de Distribuidor; el acceso a cada función está determinado por el rol fijo asignado (Administrador u Operador)

---

## 1.2 Lista de casos de uso identificados

| ID | Nombre del caso de uso | Actor primario | RF relacionado(s) |
|---|---|---|---|
| CU-01 | Visualizar catálogo de productos | Usuario no autenticado | RF-001 |
| CU-02 | Buscar productos por nombre | Usuario no autenticado | RF-002 |
| CU-03 | Filtrar catálogo por criterios | Usuario no autenticado | RF-003 |
| CU-04 | Consultar perfil del distribuidor | Usuario no autenticado | RF-004 |
| CU-05 | Consultar detalle del producto | Usuario no autenticado | RF-005 |
| CU-06 | Alternar vista del catálogo | Usuario no autenticado | RF-006 |
| CU-07 | Agregar producto al carrito | Comprador autenticado | RF-007 |
| CU-08 | Modificar cantidad de producto en carrito | Comprador autenticado | RF-007 |
| CU-09 | Eliminar producto del carrito | Comprador autenticado | RF-007 |
| CU-10 | Confirmar pedido desde el carrito | Comprador autenticado | RF-008 |
| CU-11 | Registrar cuenta de usuario | Usuario no autenticado | RF-009 |
| CU-12 | Iniciar sesión como comprador | Usuario no autenticado | RF-010 |
| CU-13 | Recuperar contraseña del comprador | Usuario no autenticado | RF-011 |
| CU-14 | Activar modo distribuidor | Comprador autenticado | RF-012 |
| CU-15 | Cambiar entre modos de usuario | Usuario con modo dual | RF-013 |
| CU-16 | Cargar nuevo producto | Distribuidor | RF-014 |
| CU-17 | Registrar precio por volumen | Distribuidor | RF-015 |
| CU-18 | Editar precio por volumen | Distribuidor | RF-016 |
| CU-19 | Eliminar precio por volumen | Distribuidor | RF-017 |
| CU-20 | Cambiar visibilidad del producto | Distribuidor | RF-018 |
| CU-21 | Editar producto | Distribuidor | RF-019 |
| CU-22 | Eliminar producto | Distribuidor | RF-020 |
| CU-23 | Visualizar stock del producto | Distribuidor | RF-021 |
| CU-24 | Configurar umbral mínimo de stock | Distribuidor | RF-022 |
| CU-25 | Filtrar productos propios | Distribuidor | RF-023 |
| CU-26 | Visualizar panel de pedidos activos | Distribuidor | RF-024, RF-055 |
| CU-27 | Aceptar pedido | Distribuidor | RF-025 |
| CU-28 | Rechazar pedido | Distribuidor | RF-026 |
| CU-29 | Proponer sustituto de producto | Distribuidor | RF-027 |
| CU-30 | Responder propuesta de sustitución | Comprador autenticado | RF-028 |
| CU-31 | Consultar centro de notificaciones | Comprador autenticado | RF-029, RF-060 |
| CU-32 | Avanzar estado del pedido | Distribuidor | RF-030 |
| CU-33 | Consultar historial de pedidos del distribuidor | Distribuidor | RF-031 |
| CU-34 | Consultar historial de pedidos del comprador | Comprador autenticado | RF-032 |
| CU-35 | Calificar distribuidor | Comprador autenticado | RF-033 |
| CU-36 | Registrar proveedor | Distribuidor | RF-034 |
| CU-37 | Editar proveedor | Distribuidor | RF-035 |
| CU-38 | Consultar lista de proveedores | Distribuidor | RF-058 |
| CU-39 | Armar pedido de reposición | Distribuidor | RF-036 |
| CU-40 | Confirmar pedido de reposición por WhatsApp | Distribuidor | RF-037 |
| CU-41 | Registrar precio por volumen del proveedor | Distribuidor | RF-038 |
| CU-42 | Consultar dashboard de rendimiento | Distribuidor | RF-039, RF-041 |
| CU-43 | Consultar rentabilidad por precio por volumen | Distribuidor | RF-040 |
| CU-44 | Crear empleado | Distribuidor | RF-042 |
| CU-45 | Iniciar sesión como empleado | Empleado | RF-043 |
| CU-46 | Cambiar contraseña en primer acceso del empleado | Empleado | RF-044 |
| CU-47 | Exportar datos del distribuidor | Distribuidor | RF-045 |
| CU-48 | Registrar dirección de partida del depósito | Distribuidor | RF-046 |
| CU-49 | Seleccionar pedidos para planificación de reparto | Distribuidor | RF-047 |
| CU-50 | Generar plan de carga | Distribuidor | RF-048 |
| CU-51 | Visualizar lista de reparto | Empleado | RF-049 |
| CU-52 | Marcar parada en plan de reparto | Empleado | RF-050 |
| CU-53 | Cerrar sesión | Empleado | RF-051 |
| CU-54 | Configurar perfil inicial del distribuidor | Distribuidor | RF-052 |
| CU-55 | Editar perfil del distribuidor | Distribuidor | RF-053 |
| CU-56 | Recuperar contraseña del empleado | Empleado | RF-054 |
| CU-57 | Gestionar lista de empleados | Distribuidor | RF-059 |
| CU-58 | Consultar detalle de pedido del comprador | Comprador autenticado | RF-056 |
| CU-59 | Consultar detalle de pedido del distribuidor | Distribuidor | RF-057 |

---

## 1.3 Tablas individuales de casos de uso

---

### CU-01 — Visualizar catálogo de productos

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Visualizar catálogo de productos |
| **Requerimiento Funcional** | RF-001 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario accede al catálogo general del sistema para explorar los productos disponibles publicados por los distribuidores. |
| **Precondición** | El sistema se encuentra operativo y accesible. |
| **Post condición** | El usuario visualiza el listado completo de productos en estado "Publicado" en vista grilla, con nombre, imagen, descripción, categoría, nombre del distribuidor y precio mínimo de cada producto. |
| **Importancia** | Esencial |
| **Resumen** | Permite a cualquier usuario explorar el catálogo de productos disponibles sin necesidad de autenticación. El sistema recupera todos los productos publicados y los presenta en vista grilla. Si no existen productos publicados, informa al usuario. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario accede a la sección del catálogo de productos. | |
| | 2- El sistema recupera todos los productos en estado "Publicado" y los muestra en vista grilla, presentando para cada uno: nombre, imagen principal (o imagen de reemplazo si no tiene), descripción, categoría, nombre del distribuidor y precio mínimo entre sus precios por volumen disponibles. |
| 3- El usuario navega por el catálogo para explorar los productos disponibles. | |
| | 4- El sistema mantiene el catálogo visible y actualizado durante la sesión. |

**Curso Alterno**

[A1] En el paso 2, si no existen productos en estado "Publicado":
  1. El sistema muestra el mensaje "No hay productos disponibles en este momento."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar los productos:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-02 — Buscar productos por nombre

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Buscar productos por nombre |
| **Requerimiento Funcional** | RF-002 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario ingresa texto libre en el campo de búsqueda del catálogo para encontrar productos cuyos nombres contengan ese texto. |
| **Precondición** | El catálogo de productos está visible (CU-01 completado o en curso). |
| **Post condición** | El catálogo muestra únicamente los productos publicados cuyos nombres contienen el texto ingresado, sin distinción de mayúsculas y minúsculas. |
| **Importancia** | Deseable |
| **Resumen** | Permite a cualquier usuario filtrar el catálogo por nombre de producto ingresando texto libre. El sistema aplica la búsqueda sobre productos publicados e informa cuando no hay coincidencias. Si el campo queda vacío, muestra el catálogo completo. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario ingresa texto en el campo de búsqueda del catálogo. | |
| | 2- El sistema filtra los productos publicados cuyos nombres contienen el texto ingresado, sin distinguir entre mayúsculas y minúsculas, y muestra el listado filtrado con los mismos campos que el catálogo general. |
| 3- El usuario consulta los resultados obtenidos. | |

**Curso Alterno**

[A1] En el paso 1, si el usuario ejecuta la búsqueda con el campo vacío:
  1. El sistema muestra el catálogo completo sin aplicar ningún filtro.
  El caso de uso termina.

[A2] En el paso 2, si ningún producto coincide con el texto ingresado:
  1. El sistema muestra el mensaje "No se encontraron productos con ese nombre."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al ejecutar la búsqueda:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-03 — Filtrar catálogo por criterios

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Filtrar catálogo por criterios |
| **Requerimiento Funcional** | RF-003 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario aplica uno o más filtros sobre el catálogo de productos para acotar los resultados según categoría, distribuidor o rango de precio. |
| **Precondición** | El catálogo de productos está visible (CU-01 completado o en curso). |
| **Post condición** | El catálogo muestra únicamente los productos publicados que cumplen con todos los criterios de filtrado aplicados. Los filtros pueden combinarse simultáneamente con la búsqueda por nombre (CU-02). |
| **Importancia** | Deseable |
| **Resumen** | Permite a cualquier usuario reducir el catálogo visible aplicando filtros por categoría, distribuidor, precio mínimo y precio máximo, de forma individual o combinada. Los filtros vacíos no restringen el resultado. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona uno o más criterios de filtrado: categoría, distribuidor, precio mínimo y/o precio máximo. | |
| | 2- El sistema valida los valores ingresados en los filtros seleccionados. |
| 3- El usuario aplica los filtros seleccionados. | |
| | 4- El sistema filtra los productos publicados que cumplen con todos los criterios activos y muestra únicamente esos productos. |

**Curso Alterno**

[A1] En el paso 4, si ningún producto coincide con los filtros aplicados:
  1. El sistema muestra el mensaje "No se encontraron productos con los filtros aplicados."
  El caso de uso termina.

[A2] En el paso 1, si el usuario deja todos los filtros vacíos:
  1. El sistema muestra el catálogo completo sin aplicar restricciones.
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al aplicar los filtros:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-04 — Consultar perfil del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar perfil del distribuidor |
| **Requerimiento Funcional** | RF-004 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario accede al perfil público de un distribuidor para conocer sus datos de negocio, zona de entrega, calificación promedio y catálogo de productos publicados. |
| **Precondición** | El sistema se encuentra operativo. El usuario ha identificado el distribuidor a consultar (p. ej., desde el catálogo o desde el detalle de un producto). |
| **Post condición** | El sistema muestra el perfil público del distribuidor con nombre, descripción, zona de entrega, calificación promedio y catálogo de sus productos publicados. |
| **Importancia** | Esencial |
| **Resumen** | Permite a cualquier usuario consultar el perfil público de un distribuidor. El sistema muestra sus datos de negocio y su catálogo activo. Si no tiene calificaciones, lo indica; si no tiene productos publicados, muestra el catálogo vacío con un mensaje informativo. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona el nombre del distribuidor para acceder a su perfil. | |
| | 2- El sistema recupera el perfil del distribuidor y muestra: nombre, descripción, zona de entrega y calificación promedio (valor numérico y representación visual). |
| 3- El usuario revisa la información del distribuidor. | |
| | 4- El sistema muestra el catálogo completo de productos publicados por ese distribuidor. |

**Curso Alterno**

[A1] En el paso 2, si el distribuidor no tiene calificaciones registradas:
  1. El sistema muestra un indicador de ausencia de calificaciones en lugar del promedio numérico.
  El flujo continúa en el paso 3.

[A2] En el paso 4, si el distribuidor no tiene productos en estado "Publicado":
  1. El sistema muestra el perfil con su información y el catálogo vacío con el mensaje "Este distribuidor no tiene productos publicados actualmente."
  El caso de uso termina.

[E1] En el paso 2, si el perfil del distribuidor no existe:
  1. El sistema muestra el mensaje "El perfil del distribuidor no está disponible."
  El caso de uso termina.

[E2] En el paso 2, si ocurre un error al recuperar el perfil:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-05 — Consultar detalle del producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar detalle del producto |
| **Requerimiento Funcional** | RF-005 |
| **Versión** | 1.1 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario accede a la página de detalle de un producto para conocer su descripción completa, categoría, tipo de producto y la tabla de precios por volumen disponibles, e ingresa la cantidad que desea para conocer el precio aplicable. |
| **Precondición** | El sistema se encuentra operativo. El usuario ha identificado el producto a consultar desde el catálogo o desde el perfil de un distribuidor. |
| **Post condición** | El sistema muestra el detalle completo del producto con su tipo (Empaquetado / Fraccionable), unidad de venta y la tabla de precios por volumen publicados. Si el usuario ingresó una cantidad válida, muestra el precio por volumen aplicable y el total calculado. |
| **Importancia** | Esencial |
| **Resumen** | Permite a cualquier usuario consultar el detalle de un producto, incluyendo su tipo, unidad de venta y la tabla de precios por volumen con sus cantidades mínimas. El sistema aplica automáticamente el precio por volumen correspondiente a la cantidad ingresada e incluye acceso al perfil del distribuidor que lo publica. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona un producto del catálogo para consultar su detalle. | |
| | 2- El sistema recupera los datos del producto y muestra: nombre, imagen principal (o imagen de reemplazo), descripción, categoría, nombre del distribuidor con enlace a su perfil (CU-04), tipo de producto (Empaquetado / Fraccionable), unidad de venta y la tabla de precios por volumen, indicando para cada uno la cantidad mínima de aplicación y el precio de venta por unidad. Si el stock disponible es cero, muestra el indicador "Sin stock disponible" sin ocultar el producto. |
| 3- El usuario ingresa la cantidad que desea comprar. | |
| | 4- El sistema valida la cantidad ingresada según el tipo de producto (para Empaquetados, número entero mayor o igual a la cantidad mínima de compra; para Fraccionables, múltiplo del incremento de venta y no menor a la cantidad mínima, admitiendo decimales en la unidad de visualización), aplica el precio por volumen cuya cantidad mínima de aplicación sea la más alta sin superar la cantidad ingresada, y muestra el precio unitario aplicable junto con el total calculado. |

**Curso Alterno**

[E1] En el paso 4, si la cantidad ingresada es inferior a la cantidad mínima de compra:
  1. El sistema muestra el mensaje "La cantidad mínima de compra es [cantidad mínima] [unidad]." y no calcula el total.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el producto es Fraccionable y la cantidad ingresada no es múltiplo del incremento de venta:
  1. El sistema muestra el mensaje "La cantidad debe ser múltiplo de [incremento] [unidad]." y no calcula el total.
  El flujo continúa en el paso 3.

[E3] En el paso 2, si el producto no existe o fue eliminado:
  1. El sistema muestra el mensaje "Este producto no está disponible."
  El caso de uso termina.

[E4] En el paso 2, si ocurre un error al recuperar el detalle:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-06 — Alternar vista del catálogo

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Alternar vista del catálogo |
| **Requerimiento Funcional** | RF-006 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario cambia la forma de visualización del catálogo de productos entre vista en grilla y vista en lista. |
| **Precondición** | El catálogo de productos está visible (CU-01 completado o en curso). La vista predeterminada activa es la vista en grilla. |
| **Post condición** | El sistema reorganiza la presentación de los productos según la vista seleccionada por el usuario. |
| **Importancia** | Opcional |
| **Resumen** | Permite a cualquier usuario alternar entre vista en grilla (columnas múltiples) y vista en lista (filas con mayor detalle horizontal) dentro del catálogo de productos. El cambio aplica sobre los productos actualmente visibles. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona la vista en lista desde el control de alternancia del catálogo. | |
| | 2- El sistema reorganiza los productos en filas con mayor detalle horizontal y actualiza el estado del control de alternancia para reflejar la vista activa. |
| 3- El usuario selecciona la vista en grilla desde el control de alternancia. | |
| | 4- El sistema reorganiza los productos en columnas múltiples y actualiza el estado del control de alternancia. |

**Curso Alterno**

[A1] En el paso 1, si el usuario selecciona la vista en grilla (que ya es la predeterminada):
  1. El sistema mantiene la vista en grilla sin cambios.
  El caso de uso termina.

---

### CU-07 — Agregar producto al carrito

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Agregar producto al carrito |
| **Requerimiento Funcional** | RF-007 |
| **Versión** | 1.1 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador ingresa la cantidad deseada de un producto con stock disponible y lo agrega a su carrito de compras. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. El comprador se encuentra en la página de detalle de un producto (CU-05). |
| **Post condición** | El producto queda registrado en el carrito del comprador con la cantidad ingresada y el precio por volumen estimado correspondiente. El carrito muestra los ítems agrupados por distribuidor con el subtotal actualizado. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador agregar un producto a su carrito especificando la cantidad deseada. El sistema valida que la cantidad cumpla la cantidad mínima de compra y, para productos Fraccionables, el incremento de venta, antes de calcular el precio por volumen estimado y agregarlo al carrito. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador ingresa la cantidad deseada en la página de detalle de un producto con stock disponible. | |
| | 2- El sistema valida que el producto tiene stock disponible mayor a cero y que la cantidad ingresada cumple la cantidad mínima de compra y, si el producto es Fraccionable, el incremento de venta. |
| 3- El comprador confirma la acción de agregar el producto al carrito. | |
| | 4- El sistema agrega el producto al carrito con la cantidad ingresada y el precio por volumen estimado correspondiente, agrupa los ítems por distribuidor, actualiza el subtotal del distribuidor correspondiente y muestra al comprador la confirmación de que el producto fue agregado. |

**Curso Alterno**

[E1] En el paso 2, si el producto no tiene stock disponible:
  1. El sistema muestra el mensaje "Este producto no tiene stock disponible."
  El caso de uso termina.

[E2] En el paso 2, si la cantidad ingresada es inferior a la cantidad mínima de compra:
  1. El sistema muestra el mensaje "La cantidad mínima de compra es [cantidad mínima] [unidad]." y no agrega el producto.
  El flujo continúa en el paso 1.

[E3] En el paso 2, si el producto es Fraccionable y la cantidad ingresada no es múltiplo del incremento de venta:
  1. El sistema muestra el mensaje "La cantidad debe ser múltiplo de [incremento] [unidad]." y no agrega el producto.
  El flujo continúa en el paso 1.

[E4] En el paso 4, si ocurre un error al registrar el ítem en el carrito:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-08 — Modificar cantidad de producto en carrito

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Modificar cantidad de producto en carrito |
| **Requerimiento Funcional** | RF-007 |
| **Versión** | 1.1 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador cambia la cantidad de un producto que ya se encuentra en su carrito de compras. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. El carrito contiene al menos un producto. |
| **Post condición** | La cantidad del ítem seleccionado queda actualizada en el carrito, junto con el precio por volumen recalculado según la nueva cantidad. El subtotal del distribuidor correspondiente se recalcula. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador ajustar la cantidad de un producto ya agregado al carrito. El sistema valida que la nueva cantidad respete la cantidad mínima de compra y, para productos Fraccionables, el incremento de venta, y recalcula el precio por volumen aplicable y el subtotal del distribuidor afectado. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede a la vista del carrito de compras. | |
| | 2- El sistema muestra los ítems del carrito agrupados por distribuidor con las cantidades actuales y subtotales. |
| 3- El comprador modifica la cantidad de un producto en el carrito ingresando el nuevo valor. | |
| | 4- El sistema valida que la nueva cantidad cumple la cantidad mínima de compra y, si el producto es Fraccionable, el incremento de venta; actualiza la cantidad del ítem, recalcula el precio por volumen aplicable y el subtotal del distribuidor correspondiente, mostrando el carrito actualizado. |

**Curso Alterno**

[E1] En el paso 4, si la nueva cantidad es inferior a la cantidad mínima de compra:
  1. El sistema muestra el mensaje "La cantidad mínima de compra es [cantidad mínima] [unidad]." y no aplica el cambio.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el producto es Fraccionable y la nueva cantidad no es múltiplo del incremento de venta:
  1. El sistema muestra el mensaje "La cantidad debe ser múltiplo de [incremento] [unidad]." y no aplica el cambio.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si ocurre un error al actualizar el carrito:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-09 — Eliminar producto del carrito

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Eliminar producto del carrito |
| **Requerimiento Funcional** | RF-007 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador elimina un producto de su carrito de compras. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. El carrito contiene al menos un producto. |
| **Post condición** | El producto seleccionado queda eliminado del carrito. El resumen del carrito se actualiza; si queda vacío, el sistema lo indica. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador quitar un ítem de su carrito. El sistema retira el producto, actualiza el resumen por distribuidor y notifica si el carrito quedó vacío. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede a la vista del carrito de compras. | |
| | 2- El sistema muestra los ítems del carrito agrupados por distribuidor con subtotales. |
| 3- El comprador selecciona la opción de eliminar un producto del carrito. | |
| | 4- El sistema retira el ítem seleccionado del carrito, actualiza el resumen por distribuidor correspondiente y muestra el carrito actualizado con los ítems restantes. |

**Curso Alterno**

[A1] En el paso 4, si al eliminar el ítem el carrito queda sin productos:
  1. El sistema muestra el mensaje "Tu carrito está vacío."
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al eliminar el ítem:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-10 — Confirmar pedido desde el carrito

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Confirmar pedido desde el carrito |
| **Requerimiento Funcional** | RF-008 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador ingresa una dirección de entrega y confirma su pedido desde el carrito, generando sub-pedidos separados por distribuidor. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. El carrito contiene al menos un producto. |
| **Post condición** | El sistema genera un sub-pedido en estado "Pendiente" por cada distribuidor presente en el carrito, registra el precio vigente en el momento de la confirmación, vacía el carrito y muestra el número de cada sub-pedido al comprador. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador formalizar su compra ingresando una dirección de entrega. El sistema genera un sub-pedido independiente por cada distribuidor, congela los precios al momento de la confirmación y vacía el carrito. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede al carrito de compras para proceder al pedido. | |
| | 2- El sistema muestra el carrito con los productos agrupados por distribuidor y sus subtotales. |
| 3- El comprador ingresa la dirección de entrega. | |
| | 4- El sistema valida que la dirección de entrega fue ingresada y que el carrito contiene al menos un producto. |
| 5- El comprador solicita confirmar el pedido. | |
| | 6- El sistema genera un sub-pedido separado en estado "Pendiente" por cada distribuidor presente en el carrito, registrando el precio de venta vigente al momento de la confirmación. Vacía el carrito y muestra al comprador el número de cada sub-pedido generado. |

**Curso Alterno**

[E1] En el paso 4, si el campo de dirección de entrega está vacío:
  1. El sistema muestra el mensaje "Debés ingresar una dirección de entrega para continuar." y no habilita la confirmación del pedido.
  El flujo continúa en el paso 3.

[E2] En el paso 6, si ocurre un error al generar los sub-pedidos:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-11 — Registrar cuenta de usuario

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Registrar cuenta de usuario |
| **Requerimiento Funcional** | RF-009 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario crea una cuenta nueva en el sistema ingresando sus datos personales y verificando su número de teléfono mediante un código SMS. |
| **Precondición** | El usuario no tiene una cuenta registrada con el número de teléfono que va a ingresar. |
| **Post condición** | La cuenta queda activa y el usuario inicia sesión automáticamente en modo comprador. |
| **Importancia** | Esencial |
| **Resumen** | Permite a un usuario nuevo crear una cuenta ingresando nombre completo, número de teléfono y contraseña. El sistema envía un código SMS para verificar el número. Solo tras ingresar el código correcto, la cuenta queda activa y el usuario accede en modo comprador. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario ingresa nombre completo, número de teléfono y contraseña en el formulario de registro. | |
| | 2- El sistema valida que el número de teléfono no está registrado previamente y envía un código de verificación por SMS al número ingresado. |
| 3- El usuario ingresa el código de verificación recibido por SMS. | |
| | 4- El sistema valida que el código ingresado es correcto y que no ha vencido, activa la cuenta e inicia la sesión del usuario en modo comprador. |

**Curso Alterno**

[E1] En el paso 2, si el número de teléfono ya está registrado en el sistema:
  1. El sistema muestra el mensaje "El número de teléfono ya está registrado. Iniciá sesión o recuperá tu contraseña." y no envía el SMS.
  El caso de uso termina.

[E2] En el paso 4, si el código SMS ingresado no coincide con el enviado:
  1. El sistema muestra el mensaje "El código ingresado no es válido. Intentá de nuevo."
  El flujo continúa en el paso 3.

[E3] En el paso 4, si el código SMS venció antes de ser ingresado (pasaron más de 10 minutos):
  1. El sistema muestra el mensaje "El código expiró. Solicitá uno nuevo." y habilita la opción de reenviar un nuevo código.
  El flujo continúa en el paso 3 tras el reenvío.

[E4] En el paso 2, si ocurre un error al enviar el SMS:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-12 — Iniciar sesión como comprador

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Iniciar sesión como comprador |
| **Requerimiento Funcional** | RF-010 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario con cuenta activa ingresa su número de teléfono y contraseña para acceder al sistema en modo comprador. |
| **Precondición** | El usuario tiene una cuenta registrada y verificada en el sistema. |
| **Post condición** | El sistema inicia la sesión del usuario y lo presenta en la pantalla principal en modo comprador. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador acceder al sistema con sus credenciales. Si las credenciales son correctas, se inicia la sesión en modo comprador. El sistema distingue entre credenciales incorrectas, cuenta inexistente y cuenta no verificada. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario ingresa su número de teléfono y contraseña en el formulario de inicio de sesión. | |
| | 2- El sistema valida que el número de teléfono está registrado, que la cuenta está verificada y que la contraseña corresponde, inicia la sesión del usuario y muestra la pantalla principal en modo comprador. |
| 3- El usuario accede a las funcionalidades del modo comprador. | |

**Curso Alterno**

[E1] En el paso 2, si las credenciales son incorrectas (contraseña no coincide):
  1. El sistema muestra el mensaje "El teléfono o la contraseña son incorrectos."
  El flujo continúa en el paso 1.

[E2] En el paso 2, si el número de teléfono no está registrado en el sistema:
  1. El sistema muestra el mensaje "No encontramos una cuenta con ese número de teléfono."
  El caso de uso termina.

[E3] En el paso 2, si la cuenta existe pero no fue verificada por SMS:
  1. El sistema muestra el mensaje "Tu cuenta aún no fue verificada. Revisá el SMS que te enviamos." y ofrece la opción de reenviar el código de verificación.
  El caso de uso termina.

---

### CU-13 — Recuperar contraseña del comprador

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Recuperar contraseña del comprador |
| **Requerimiento Funcional** | RF-011 |
| **Versión** | 1.0 |
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario que no recuerda su contraseña solicita un código SMS para verificar su identidad y establecer una nueva contraseña. |
| **Precondición** | El usuario tiene una cuenta registrada y verificada en el sistema. |
| **Post condición** | La contraseña de la cuenta queda actualizada con el nuevo valor ingresado. El código de recuperación utilizado queda inválido. El usuario es redirigido al inicio de sesión. |
| **Importancia** | Deseable |
| **Resumen** | Permite al comprador restablecer su contraseña mediante verificación por SMS. Tras ingresar el código correcto dentro del período de validez, puede definir una nueva contraseña. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario ingresa su número de teléfono registrado en el formulario de recuperación de contraseña. | |
| | 2- El sistema valida que el número está registrado y envía un código de verificación por SMS con validez de 10 minutos. |
| 3- El usuario ingresa el código de verificación recibido por SMS. | |
| | 4- El sistema valida que el código es correcto y habilita el campo para ingresar la nueva contraseña. |
| 5- El usuario ingresa y confirma la nueva contraseña. | |
| | 6- El sistema actualiza la contraseña, invalida el código de recuperación y redirige al usuario al inicio de sesión con el mensaje "Tu contraseña fue actualizada correctamente." |

**Curso Alterno**

[E1] En el paso 2, si el número de teléfono no está registrado:
  1. El sistema muestra el mensaje "No encontramos una cuenta con ese número de teléfono."
  El caso de uso termina.

[E2] En el paso 4, si el código SMS ingresado es incorrecto:
  1. El sistema muestra el mensaje "El código ingresado no es válido. Intentá de nuevo."
  El flujo continúa en el paso 3.

[E3] En el paso 4, si el código SMS venció (pasaron más de 10 minutos):
  1. El sistema muestra el mensaje "El código expiró. Solicitá uno nuevo." y habilita la opción de solicitar un nuevo código.
  El flujo continúa en el paso 1.

---

### CU-14 — Activar modo distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Activar modo distribuidor |
| **Requerimiento Funcional** | RF-012 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador autenticado activa el modo distribuidor en su cuenta para habilitar el acceso al panel de gestión del distribuidor. |
| **Precondición** | El usuario tiene una sesión activa en modo comprador. El modo distribuidor no está activo todavía en la cuenta. |
| **Post condición** | El modo distribuidor queda habilitado en la cuenta del usuario, que pasa a tener modo dual. El usuario es dirigido al flujo de configuración inicial del perfil del distribuidor (CU-54) antes de obtener acceso al panel. |
| **Importancia** | Esencial |
| **Resumen** | Permite a un comprador convertirse también en distribuidor sin crear una cuenta nueva. La activación requiere confirmación explícita. Solo puede existir un modo distribuidor activo por cuenta; si ya está activo, el sistema no vuelve a ofrecer la opción. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador selecciona la opción de activar el modo distribuidor desde su cuenta. | |
| | 2- El sistema solicita confirmación explícita de la activación. |
| 3- El comprador confirma la activación. | |
| | 4- El sistema habilita el modo distribuidor en la cuenta y redirige al flujo de configuración inicial del perfil del distribuidor (CU-54) antes de dar acceso al panel. |

**Curso Alterno**

[A1] En el paso 3, si el comprador cancela la activación:
  1. El sistema no realiza cambios en la cuenta y mantiene al usuario en modo comprador.
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al habilitar el modo distribuidor:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-15 — Cambiar entre modos de usuario

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Cambiar entre modos de usuario |
| **Requerimiento Funcional** | RF-013 |
| **Versión** | 1.0 |
| **Actor** | Usuario con modo dual |
| **Descripción** | El usuario que tiene habilitados tanto el modo comprador como el modo distribuidor alterna entre ellos sin cerrar sesión. |
| **Precondición** | El usuario tiene una sesión activa con ambos modos habilitados (comprador y distribuidor activado mediante CU-14). |
| **Post condición** | El sistema muestra la interfaz correspondiente al modo seleccionado: panel del distribuidor o vista del comprador. La sesión permanece activa durante el cambio. |
| **Importancia** | Esencial |
| **Resumen** | Permite a un usuario con doble modo activo cambiar su contexto de trabajo entre el panel del distribuidor y la vista del comprador sin necesidad de cerrar sesión ni cambiar de cuenta. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona la opción de cambio de modo desde el control de alternancia de la interfaz. | |
| | 2- El sistema identifica el modo activo actual y determina el modo destino. |
| 3- El usuario confirma el cambio de modo. | |
| | 4- El sistema presenta la interfaz correspondiente al modo seleccionado manteniendo la sesión activa. |

**Curso Alterno**

[A1] En el paso 4, si el usuario cambia al modo distribuidor:
  1. El sistema muestra el panel del distribuidor con sus funciones específicas.
  El caso de uso termina.

[A2] En el paso 4, si el usuario cambia al modo comprador:
  1. El sistema muestra la vista del comprador con su historial y carrito.
  El caso de uso termina.

---

### CU-16 — Cargar nuevo producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Cargar nuevo producto |
| **Requerimiento Funcional** | RF-014 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor crea un nuevo producto en el sistema ingresando foto, nombre, descripción, categoría, tipo de producto (Empaquetado o Fraccionable) y los datos específicos del tipo elegido. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor con el perfil de distribuidora configurado (CU-54 completado). |
| **Post condición** | El nuevo producto queda creado en estado "Pausado" y aparece en el panel de productos del distribuidor. No es visible en el catálogo público hasta tener al menos un precio por volumen (CU-17) y ser publicado (CU-20). |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor crear un nuevo producto con sus datos básicos y su tipo. Si es Empaquetado, registra la descripción de la unidad de venta y la cantidad mínima de compra en unidades enteras. Si es Fraccionable, registra la unidad base interna (Gramo, Mililitro o Centímetro), el incremento de venta, la cantidad mínima de compra y la métrica de visualización de stock (Kilogramos, Litros o Metros) derivada de la unidad base. El producto se crea en estado "Pausado" por defecto. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de carga de nuevo producto y selecciona el tipo de producto: Empaquetado o Fraccionable. | |
| | 2- El sistema muestra el formulario de creación con los campos comunes (foto, nombre, descripción, categoría, stock inicial) y los campos específicos del tipo seleccionado. |
| 3- El distribuidor completa los campos obligatorios: nombre, categoría, tipo de producto, stock inicial y los datos específicos del tipo elegido (unidad de venta y cantidad mínima de compra si es Empaquetado; unidad base interna, incremento de venta, cantidad mínima de compra y métrica de visualización si es Fraccionable). | |
| | 4- El sistema valida que el nombre no está vacío, que se seleccionó una categoría y un tipo de producto, que el stock inicial no es negativo, que la cantidad mínima de compra es mayor a cero y que el incremento de venta es mayor a cero cuando el producto es Fraccionable; crea el producto en estado "Pausado" y lo presenta en el panel de productos del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el nombre del producto está vacío:
  1. El sistema muestra el mensaje "El nombre del producto es obligatorio." y no crea el producto.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si no se seleccionó el tipo de producto:
  1. El sistema muestra el mensaje "Debés seleccionar el tipo de producto." y no crea el producto.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si el stock inicial ingresado es negativo:
  1. El sistema muestra el mensaje "El stock inicial no puede ser negativo." y no crea el producto.
  El flujo continúa en el paso 3.

[E4] En el paso 4, si la cantidad mínima de compra es cero o negativa:
  1. El sistema muestra el mensaje "La cantidad mínima de compra debe ser mayor a cero." y no crea el producto.
  El flujo continúa en el paso 3.

[E5] En el paso 4, si el producto es Fraccionable y el incremento de venta es cero o negativo:
  1. El sistema muestra el mensaje "El incremento de venta debe ser mayor a cero." y no crea el producto.
  El flujo continúa en el paso 3.

[E6] En el paso 4, si ocurre un error al guardar el producto:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-17 — Registrar precio por volumen

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Registrar precio por volumen |
| **Requerimiento Funcional** | RF-015 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor registra un nuevo precio por volumen para uno de sus productos, ya sea durante la creación del producto o posteriormente desde su panel de gestión, indicando la cantidad mínima de aplicación, el precio de venta por unidad y el precio de costo por unidad. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un producto creado en su catálogo (CU-16 completado). |
| **Post condición** | El nuevo precio por volumen queda registrado en el producto y aparece en el listado de precios del producto dentro del panel del distribuidor. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor definir, para cualquiera de sus productos, los distintos precios unitarios que aplican a partir de determinadas cantidades mínimas de compra. La cantidad mínima de aplicación se expresa en unidades para productos Empaquetados y en la unidad de visualización para productos Fraccionables. Un producto necesita al menos un precio por volumen para poder publicarse. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al detalle de un producto existente y selecciona la opción de agregar un nuevo precio por volumen. | |
| | 2- El sistema muestra el formulario de nuevo precio por volumen con los campos: cantidad mínima de aplicación, precio de venta por unidad y precio de costo por unidad. |
| 3- El distribuidor completa los campos del nuevo precio por volumen. | |
| | 4- El sistema valida que el precio de venta es mayor a cero, que el precio de costo no es negativo y que la cantidad mínima de aplicación es mayor a cero; registra el precio por volumen y lo muestra en el listado de precios del producto. |

**Curso Alterno**

[E1] En el paso 4, si el precio de venta es cero o negativo:
  1. El sistema muestra el mensaje "El precio de venta debe ser mayor a cero." y no registra el precio por volumen.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el precio de costo es negativo:
  1. El sistema muestra el mensaje "El precio de costo no puede ser negativo." y no registra el precio por volumen.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si la cantidad mínima de aplicación es cero o negativa:
  1. El sistema muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no registra el precio por volumen.
  El flujo continúa en el paso 3.

[E4] En el paso 4, si ocurre un error al guardar el precio por volumen:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-18 — Editar precio por volumen

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Editar precio por volumen |
| **Requerimiento Funcional** | RF-016 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor edita la cantidad mínima de aplicación, el precio de venta por unidad o el precio de costo por unidad de un precio por volumen ya registrado en cualquiera de sus productos. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un precio por volumen registrado en el producto (CU-17 completado). |
| **Post condición** | El precio por volumen queda actualizado con los nuevos datos. Los pedidos en estado "Pendiente" o "Aceptado" que referencian este precio conservan el precio de venta registrado al momento de su confirmación, sin importar los cambios posteriores. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor corregir o actualizar un precio por volumen existente. Las mismas reglas de validez que rigen el registro inicial (precio de venta mayor a cero, precio de costo no negativo, cantidad mínima mayor a cero) aplican a la edición. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al listado de precios por volumen de un producto y selecciona uno para editar. | |
| | 2- El sistema muestra el formulario de edición con los datos actuales del precio por volumen: cantidad mínima de aplicación, precio de venta y precio de costo. |
| 3- El distribuidor modifica los campos deseados y confirma los cambios. | |
| | 4- El sistema valida que el precio de venta es mayor a cero, que el precio de costo no es negativo y que la cantidad mínima de aplicación es mayor a cero; actualiza el precio por volumen y muestra los datos actualizados en el listado de precios del producto. |

**Curso Alterno**

[E1] En el paso 4, si el precio de venta queda cero o negativo:
  1. El sistema muestra el mensaje "El precio de venta debe ser mayor a cero." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el precio de costo queda negativo:
  1. El sistema muestra el mensaje "El precio de costo no puede ser negativo." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si la cantidad mínima de aplicación queda cero o negativa:
  1. El sistema muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E4] En el paso 4, si ocurre un error al guardar los cambios:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-19 — Eliminar precio por volumen

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Eliminar precio por volumen |
| **Requerimiento Funcional** | RF-017 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor elimina un precio por volumen registrado en cualquiera de sus productos. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un precio por volumen registrado en el producto (CU-17 completado). |
| **Post condición** | El precio por volumen queda eliminado y deja de aparecer en el listado de precios del producto. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor retirar un precio por volumen que ya no aplica. El sistema bloquea la eliminación si es el único precio por volumen de un producto publicado, o si tiene pedidos en estado "Pendiente" o "Aceptado" que lo referencian. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al listado de precios por volumen de un producto y selecciona la opción de eliminar uno de ellos. | |
| | 2- El sistema verifica que el precio por volumen no es el único registrado para un producto publicado y que no tiene pedidos en estado "Pendiente" ni "Aceptado" que lo referencian. |
| 3- El distribuidor confirma la eliminación. | |
| | 4- El sistema elimina el precio por volumen y actualiza el listado de precios del producto con el mensaje "El precio por volumen fue eliminado correctamente." |

**Curso Alterno**

[E1] En el paso 2, si el precio por volumen es el único registrado para un producto en estado "Publicado":
  1. El sistema muestra el mensaje "No es posible eliminar el único precio por volumen de un producto publicado." y no lo elimina.
  El caso de uso termina.

[E2] En el paso 2, si el precio por volumen tiene pedidos en estado "Pendiente" o "Aceptado" que lo referencian:
  1. El sistema muestra el mensaje "No es posible eliminar este precio porque tiene pedidos pendientes o aceptados." y no lo elimina.
  El caso de uso termina.

[E3] En el paso 4, si ocurre un error al ejecutar la eliminación:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-20 — Cambiar visibilidad del producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Cambiar visibilidad del producto |
| **Requerimiento Funcional** | RF-018 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor cambia el estado de visibilidad de uno de sus productos entre "Publicado" y "Pausado" desde el panel de gestión de productos. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. El producto al que se le cambiará la visibilidad existe en su catálogo. |
| **Post condición** | El producto queda en el nuevo estado de visibilidad. Si fue publicado, aparece visible en el catálogo público. Si fue pausado, deja de aparecer en el catálogo pero sus precios por volumen y pedidos activos se mantienen sin cambios. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor publicar un producto para hacerlo visible en el catálogo o pausarlo para ocultarlo temporalmente. Para publicar, el producto debe tener al menos un precio por volumen definido (CU-17). Pausar un producto no afecta los pedidos activos que lo incluyen. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de gestión de productos e identifica el producto cuya visibilidad desea cambiar. | |
| | 2- El sistema muestra el estado de visibilidad actual del producto. |
| 3- El distribuidor selecciona la acción de publicar el producto. | |
| | 4- El sistema valida que el producto tiene al menos un precio por volumen definido, cambia el estado del producto a "Publicado" y el producto queda visible en el catálogo público. |

**Curso Alterno**

[A1] En el paso 3, si el distribuidor selecciona pausar el producto (en lugar de publicar):
  1. El sistema cambia el estado del producto a "Pausado", lo retira del catálogo público y mantiene sus precios por volumen y pedidos activos sin cambios.
  El caso de uso termina.

[E1] En el paso 4, si el distribuidor intenta publicar un producto sin precios por volumen definidos:
  1. El sistema muestra el mensaje "El producto necesita al menos un precio por volumen para poder ser publicado." y no cambia el estado.
  El caso de uso termina.

[E2] En el paso 4, si ocurre un error al actualizar el estado:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-21 — Editar producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Editar producto |
| **Requerimiento Funcional** | RF-019 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor modifica los datos generales de uno de sus productos existentes: nombre, descripción, categoría, foto, datos de unidad y cantidad mínima de compra según su tipo, y stock actual. Los precios por volumen se editan por separado (CU-18). |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un producto en su catálogo. |
| **Post condición** | El producto queda actualizado con los nuevos datos ingresados. Los pedidos en estado "Pendiente" o "Aceptado" que incluyen ese producto conservan el precio de venta registrado en el momento de su confirmación. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor actualizar nombre, descripción, categoría, foto, cantidad mínima de compra, y según el tipo de producto, la descripción de la unidad de venta (Empaquetados) o el incremento de venta y la métrica de visualización (Fraccionables), además del stock actual. El sistema protege el stock comprometido en pedidos activos, impidiendo reducirlo por debajo del stock reservado, y bloquea el cambio de tipo de producto si ya tiene pedidos registrados. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de gestión, selecciona un producto y elige la opción de editar. | |
| | 2- El sistema muestra el formulario de edición con los datos actuales del producto según su tipo. |
| 3- El distribuidor modifica los campos deseados: nombre, descripción, categoría, foto, cantidad mínima de compra, datos específicos del tipo y/o stock actual. | |
| | 4- El sistema valida que el nombre no quede vacío, que el stock no se reduzca por debajo del stock reservado en pedidos activos, y que el tipo de producto no se modifique si el producto ya tiene pedidos registrados; guarda los cambios y muestra el producto actualizado en el panel. |

**Curso Alterno**

[E1] En el paso 4, si el distribuidor intenta reducir el stock por debajo del stock reservado en pedidos activos:
  1. El sistema muestra el mensaje "No es posible reducir el stock por debajo de las unidades reservadas en pedidos activos." y no aplica el cambio de stock.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el distribuidor intenta modificar el tipo de producto y este ya tiene pedidos registrados en cualquier estado:
  1. El sistema muestra el mensaje "El tipo de producto no puede modificarse cuando el producto tiene pedidos registrados." y no aplica el cambio.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si el nombre del producto queda vacío:
  1. El sistema muestra el mensaje "El nombre del producto es obligatorio." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E4] En el paso 4, si ocurre un error al guardar los cambios:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-22 — Eliminar producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Eliminar producto |
| **Requerimiento Funcional** | RF-020 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor elimina uno de sus productos. Si el producto no tiene ningún registro asociado (pedidos, propuestas de sustitución, precios de proveedor o pedidos de reposición), el sistema lo elimina físicamente; si tiene al menos uno, lo deshabilita en su lugar. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un producto en su catálogo. |
| **Post condición** | Si el producto no tenía registros asociados, queda eliminado del sistema. Si tenía al menos uno, queda deshabilitado de forma permanente, con su estado de visibilidad en "Pausado", sin poder volver a publicarse ni habilitarse. Las referencias históricas al producto (en historial de pedidos y páginas de detalle) muestran su nombre con el indicador "No disponible". |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor retirar un producto de su catálogo. El sistema decide automáticamente entre eliminación física y deshabilitación según si el producto tiene historial vinculado en pedidos, propuestas de sustitución, precios de proveedor o pedidos de reposición, en cualquier estado. La deshabilitación es permanente y no puede revertirse desde la interfaz. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de gestión, selecciona un producto y elige la opción de eliminar. | |
| | 2- El sistema verifica si el producto tiene al menos un registro asociado (pedido, propuesta de sustitución, precio de proveedor o pedido de reposición) en cualquier estado. |
| 3- El distribuidor confirma la eliminación. | |
| | 4- El sistema elimina el producto de la base de datos y muestra el mensaje "El producto fue eliminado correctamente." |

**Curso Alterno**

[A1] En el paso 2, si el producto tiene al menos un registro asociado:
  1. El sistema deshabilita el producto en lugar de eliminarlo, cambia su estado de visibilidad a "Pausado" en la misma operación y muestra el mensaje "Este producto tiene historial registrado y no puede eliminarse. El producto fue deshabilitado y ya no estará disponible para nuevas operaciones."
  2. Las referencias existentes al producto en el historial de pedidos y en páginas de detalle muestran su nombre junto a la etiqueta "No disponible".
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al ejecutar la eliminación:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-23 — Visualizar stock del producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Visualizar stock del producto |
| **Requerimiento Funcional** | RF-021 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor consulta los niveles de stock disponible y stock reservado de cada uno de sus productos desde el panel de gestión, expresados en la unidad correspondiente a su tipo. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un producto en su catálogo. |
| **Post condición** | El distribuidor visualiza para cada producto el stock disponible (libre para nuevos pedidos) y el stock reservado (comprometido en pedidos en estado "Aceptado" pendientes de entrega), visualmente diferenciados. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor conocer el estado real de su inventario distinguiendo entre unidades libres y unidades ya comprometidas. Para productos Empaquetados, los valores se expresan en unidades enteras; para Fraccionables, en la métrica de visualización elegida (Kilogramos, Litros o Metros), con conversión automática desde la unidad base interna y aceptando decimales. Si el stock disponible es cero, el sistema lo indica visualmente. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de gestión de productos. | |
| | 2- El sistema muestra el listado de productos del distribuidor. |
| 3- El distribuidor selecciona un producto para revisar su estado de stock. | |
| | 4- El sistema muestra el stock disponible y el stock reservado del producto seleccionado, en la unidad correspondiente a su tipo (unidades enteras si es Empaquetado; métrica de visualización con conversión automática y decimales si es Fraccionable), de forma visualmente diferenciada. Si el stock disponible es cero, lo indica como "Sin stock disponible". |

**Curso Alterno**

[A1] En el paso 4, si el stock disponible del producto es cero:
  1. El sistema muestra el indicador "Sin stock disponible" junto al valor de stock reservado correspondiente.
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar la información de stock:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-24 — Configurar umbral mínimo de stock

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Configurar umbral mínimo de stock |
| **Requerimiento Funcional** | RF-022 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor define un valor de umbral mínimo de stock para un producto, de modo que el sistema lo notifique cuando el stock disponible descienda por debajo de ese valor. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un producto en su catálogo. |
| **Post condición** | El umbral mínimo queda registrado para el producto seleccionado. Si el stock disponible ya está por debajo del umbral al momento del registro, el sistema no emite notificación retroactiva; la notificación solo se activa cuando el stock cruza el umbral hacia abajo en un evento posterior. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor configurar una alerta automática de bajo stock por producto. El umbral se expresa en unidades para productos Empaquetados y en la métrica de visualización para productos Fraccionables, y debe ser un valor no negativo. La notificación se envía solo la primera vez que el stock cruza el umbral hacia abajo. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al detalle de un producto en el panel de gestión. | |
| | 2- El sistema muestra los datos actuales del producto, incluyendo el campo de umbral mínimo de stock en la unidad correspondiente a su tipo. |
| 3- El distribuidor ingresa el valor del umbral mínimo de stock para ese producto. | |
| | 4- El sistema valida que el valor ingresado no es negativo, registra el umbral y lo muestra en el panel del producto junto con los valores de stock (CU-23). |

**Curso Alterno**

[A1] Tras el paso 4, si el stock disponible desciende por debajo del umbral configurado en un evento posterior (p. ej., aceptación de un pedido):
  1. El sistema muestra una notificación al distribuidor con el nombre del producto afectado.
  El caso de uso termina.

[E1] En el paso 4, si el valor ingresado es negativo:
  1. El sistema muestra el mensaje "El umbral mínimo no puede ser negativo." y no registra el valor.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al guardar el umbral:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-25 — Filtrar productos propios

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Filtrar productos propios |
| **Requerimiento Funcional** | RF-023 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor aplica filtros sobre su propio listado de productos en el panel de gestión para acotar los resultados según categoría, estado de visibilidad y/o estado de stock. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Se encuentra en el panel de gestión de productos. |
| **Post condición** | El listado de productos del distribuidor muestra únicamente los productos que coinciden con los criterios de filtrado activos. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor localizar rápidamente productos de su catálogo filtrando por categoría, estado de visibilidad ("Publicado"/"Pausado") y estado de stock ("Con stock"/"Sin stock"), individualmente o combinados. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de gestión de productos. | |
| | 2- El sistema muestra el listado completo de productos del distribuidor con los controles de filtrado disponibles. |
| 3- El distribuidor selecciona uno o más criterios de filtrado: categoría, estado de visibilidad y/o estado de stock. | |
| | 4- El sistema aplica los filtros seleccionados y muestra únicamente los productos que cumplen con todos los criterios activos. |

**Curso Alterno**

[A1] En el paso 4, si ningún producto coincide con los filtros aplicados:
  1. El sistema muestra el mensaje "No hay productos que coincidan con los filtros aplicados."
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al aplicar los filtros:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-26 — Visualizar panel de pedidos activos

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Visualizar panel de pedidos activos |
| **Requerimiento Funcional** | RF-024, RF-055 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor consulta su panel de pedidos activos para ver todos los sub-pedidos en estado "Pendiente", "Aceptado" o "En camino", incluyendo los datos del comprador, los productos solicitados y el stock disponible al momento de la consulta. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El distribuidor visualiza el listado completo de pedidos activos con todos sus datos y las acciones disponibles según el estado de cada pedido. Los nuevos pedidos entrantes (RF-024) aparecen en este panel. |
| **Importancia** | Esencial |
| **Resumen** | Centraliza la gestión operativa de pedidos del distribuidor mostrando los pedidos no finalizados. Para cada pedido muestra número, estado, datos del comprador, fecha, productos con cantidad, stock disponible y las acciones habilitadas según el estado actual. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de pedidos activos. | |
| | 2- El sistema recupera todos los sub-pedidos en estado "Pendiente", "Aceptado" o "En camino" pertenecientes al distribuidor y muestra el listado de pedidos activos. Para cada pedido presenta: número de pedido, estado actual, nombre del comprador, número de teléfono del comprador, fecha de creación, lista de productos con cantidad en la unidad del producto, stock disponible de cada producto al momento de la consulta, y acciones disponibles según el estado (Pendiente: Aceptar / Rechazar / Proponer sustituto; Aceptado: Marcar como En camino; En camino: Marcar como Entregado). |
| 3- El distribuidor revisa los pedidos activos para tomar las acciones correspondientes. | |

**Curso Alterno**

[A1] En el paso 2, si el distribuidor no tiene pedidos activos:
  1. El sistema muestra el mensaje "No tenés pedidos activos en este momento."
  El caso de uso termina.

[A2] Mientras el panel está visible, si un comprador confirma un nuevo pedido dirigido a este distribuidor:
  1. El sistema registra la notificación del nuevo pedido (RF-024) y lo incorpora al panel de pedidos activos en estado "Pendiente" con todos los datos del comprador y los productos solicitados.
  El flujo continúa en el paso 3.

[E1] En el paso 2, si ocurre un error al recuperar los pedidos:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-27 — Aceptar pedido

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Aceptar pedido |
| **Requerimiento Funcional** | RF-025 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor acepta un pedido en estado "Pendiente", reservando el stock de los productos incluidos y abriendo WhatsApp con un mensaje pre-redactado para el comprador. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en estado "Pendiente" en el panel de pedidos activos. |
| **Post condición** | El pedido queda en estado "Aceptado". El stock de todos los productos incluidos queda reservado e indisponible para nuevos pedidos. WhatsApp se abre en el dispositivo del distribuidor con un mensaje pre-redactado dirigido al número del comprador, incluyendo número del pedido, confirmación de aceptación y detalle de los productos con sus cantidades en la unidad del producto. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor confirmar la aceptación de un pedido pendiente. El sistema reserva el stock comprometido, cambia el estado y prepara la comunicación con el comprador a través de WhatsApp mediante un deep link (sin usar la API oficial de WhatsApp Business). Si el stock disponible es insuficiente para algún producto del pedido, el sistema bloquea la aceptación. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un pedido en estado "Pendiente" del panel de pedidos activos. | |
| | 2- El sistema muestra el detalle del pedido con todos sus datos. |
| 3- El distribuidor selecciona la acción de aceptar el pedido. | |
| | 4- El sistema verifica que hay stock suficiente para cubrir todos los productos del pedido, cambia el estado del pedido a "Aceptado", reserva el stock de todos los productos incluidos (haciéndolo indisponible para nuevos pedidos) y genera un deep link de WhatsApp (wa.me) con un mensaje pre-redactado dirigido al número del comprador, incluyendo el número del pedido, la confirmación de aceptación y el detalle de los productos con sus cantidades, abriéndolo en el dispositivo del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el stock disponible es insuficiente para cubrir algún producto del pedido:
  1. El sistema muestra el mensaje "No hay stock suficiente para aceptar este pedido. Revisá el inventario antes de continuar." y no cambia el estado del pedido.
  El caso de uso termina.

[E2] En el paso 4, si ocurre un error al actualizar el estado del pedido:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-28 — Rechazar pedido

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Rechazar pedido |
| **Requerimiento Funcional** | RF-026 |
| **Versión** | 1.1 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor rechaza un pedido en estado "Pendiente" o "En camino" ingresando un motivo de rechazo. El sistema cambia el estado del pedido, libera el stock reservado y notifica al comprador. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en estado "Pendiente" o "En camino". |
| **Post condición** | El pedido queda en estado "Rechazado". El stock reservado asociado al pedido queda liberado de forma inmediata. El comprador recibe una notificación con el número de pedido y el motivo de rechazo. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor rechazar un pedido en cualquiera de los dos estados en que esto es posible. El motivo es obligatorio en ambos casos: para pedidos "Pendiente" se selecciona de una lista predefinida (Sin stock del producto solicitado, Producto discontinuado, Pedido fuera de la zona de entrega, Error en los datos del pedido, Distribuidora no disponible en la fecha solicitada); para pedidos "En camino" es texto libre que describe la situación ocurrida durante la entrega. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un pedido en estado "Pendiente" y elige la acción de rechazar. | |
| | 2- El sistema muestra la lista de motivos de rechazo predefinidos. |
| 3- El distribuidor selecciona un motivo de la lista y confirma el rechazo. | |
| | 4- El sistema valida que se seleccionó un motivo, cambia el estado del pedido a "Rechazado", libera el stock reservado y envía al comprador una notificación con el número de pedido y el motivo de rechazo seleccionado. |

**Curso Alterno**

[A1] En el paso 1, si el distribuidor rechaza un pedido en estado "En camino" en lugar de "Pendiente":
  1. El sistema solicita al distribuidor el ingreso de un motivo de rechazo en texto libre, en lugar de la lista predefinida.
  2. El distribuidor ingresa el motivo y confirma el rechazo.
  3. El sistema valida que el campo de motivo no está vacío.
  4. El sistema cambia el estado del pedido a "Rechazado", libera el stock reservado y envía al comprador una notificación con el número de pedido y el motivo ingresado.
  El caso de uso termina.

[E1] En el paso 4, si el distribuidor intenta confirmar sin haber seleccionado o ingresado un motivo:
  1. El sistema muestra el mensaje "Ingresá un motivo de rechazo antes de confirmar." y no procesa el rechazo.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al procesar el rechazo:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-29 — Proponer sustituto de producto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Proponer sustituto de producto |
| **Requerimiento Funcional** | RF-027 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor propone un producto alternativo de su propio catálogo para sustituir un artículo de un pedido en estado "Pendiente", notificando al comprador para que decida. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en estado "Pendiente" en su panel. El distribuidor tiene al menos un producto alternativo disponible en su catálogo para proponer como sustituto. |
| **Post condición** | La propuesta de sustitución queda registrada. El pedido permanece en estado "Pendiente". El comprador recibe una notificación mostrando el producto original y el sustituto propuesto. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor ofrecer un producto alternativo cuando no puede satisfacer un artículo del pedido original. El sustituto debe pertenecer al mismo catálogo del distribuidor. El pedido queda suspendido hasta que el comprador responda. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un artículo de un pedido en estado "Pendiente" y elige la opción de proponer sustituto. | |
| | 2- El sistema muestra el listado de productos disponibles en el catálogo del distribuidor para seleccionar como sustituto. |
| 3- El distribuidor selecciona un producto sustituto de la lista y confirma la propuesta. | |
| | 4- El sistema valida que se seleccionó un sustituto perteneciente al catálogo del mismo distribuidor, registra la propuesta de sustitución y envía una notificación al comprador mostrando el producto original y el sustituto propuesto. El pedido permanece en estado "Pendiente". |

**Curso Alterno**

[E1] En el paso 4, si el distribuidor intenta confirmar sin haber seleccionado un sustituto:
  1. El sistema muestra el mensaje "Seleccioná un producto sustituto antes de enviar la propuesta." y no envía la propuesta.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al registrar la propuesta:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-30 — Responder propuesta de sustitución

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Responder propuesta de sustitución |
| **Requerimiento Funcional** | RF-028 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador acepta o rechaza la propuesta de sustitución de producto realizada por el distribuidor, desde la vista de detalle de su pedido. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. Existe una propuesta de sustitución pendiente de respuesta en alguno de sus pedidos (pedido en estado "Pendiente" con propuesta de sustitución activa). |
| **Post condición** | Si el comprador acepta: el pedido queda actualizado con el producto sustituto y el distribuidor es notificado. Si el comprador rechaza: el producto original se mantiene en el pedido y el distribuidor es notificado. La propuesta queda cerrada y no puede modificarse. |
| **Importancia** | Deseable |
| **Resumen** | Permite al comprador decidir si acepta o rechaza el producto alternativo propuesto por el distribuidor. La respuesta actualiza el pedido y notifica al distribuidor del resultado. Una propuesta ya respondida no puede modificarse. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede al detalle del pedido con la propuesta de sustitución pendiente (CU-58). | |
| | 2- El sistema muestra el producto original y el sustituto propuesto con las opciones de Aceptar y Rechazar activas. |
| 3- El comprador selecciona la opción de aceptar la propuesta de sustitución. | |
| | 4- El sistema actualiza el pedido reemplazando el producto original por el sustituto y notifica al distribuidor que el cambio fue aceptado. |

**Curso Alterno**

[A1] En el paso 3, si el comprador selecciona la opción de rechazar la propuesta:
  1. El sistema mantiene el producto original en el pedido y notifica al distribuidor que el cambio fue rechazado.
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al procesar la respuesta:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-31 — Consultar centro de notificaciones

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar centro de notificaciones |
| **Requerimiento Funcional** | RF-029, RF-060 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador accede al centro de notificaciones del sistema para revisar los cambios de estado de sus pedidos y marcar notificaciones como leídas. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. |
| **Post condición** | El comprador visualiza el listado de notificaciones ordenadas de más reciente a más antigua. Las notificaciones abiertas quedan marcadas como leídas. |
| **Importancia** | Deseable |
| **Resumen** | Permite al comprador acceder a todas las notificaciones generadas por cambios de estado en sus pedidos (Pendiente→Aceptado, Pendiente→Rechazado, Aceptado→En camino, En camino→Entregado). Cada notificación incluye número de pedido, nuevo estado, motivo de rechazo (cuando aplica) y fecha/hora. Desde cada notificación se puede acceder al detalle del pedido. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede al centro de notificaciones. | |
| | 2- El sistema recupera las notificaciones del comprador y las muestra ordenadas de más reciente a más antigua, indicando para cada una: número de pedido, nuevo estado, motivo de rechazo (si el estado es "Rechazado"), fecha y hora, e indicador visual de leída/no leída. |
| 3- El comprador selecciona una notificación para revisarla. | |
| | 4- El sistema marca la notificación como leída y muestra el detalle del pedido correspondiente (CU-58). |

**Curso Alterno**

[A1] En el paso 2, si el comprador no tiene notificaciones:
  1. El sistema muestra el mensaje "No tenés notificaciones."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar las notificaciones:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-32 — Avanzar estado del pedido

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Avanzar estado del pedido |
| **Requerimiento Funcional** | RF-030 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor avanza el estado de un pedido aceptado a través de la secuencia: "Aceptado" → "En camino" → "Entregado". Al marcar como "Entregado", el sistema descuenta el stock reservado del inventario. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en estado "Aceptado" o "En camino" en su panel. |
| **Post condición** | El pedido avanza al siguiente estado de la secuencia. El comprador recibe una notificación del cambio de estado. Si el nuevo estado es "Entregado", el stock reservado queda descontado definitivamente del inventario. |
| **Importancia** | Esencial |
| **Resumen** | Permite al distribuidor registrar el progreso de la entrega de un pedido. La secuencia de estados es unidireccional: no puede retroceder. El descuento definitivo de inventario ocurre solo al transitar a "Entregado". El comprador es notificado en cada transición. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un pedido en estado "Aceptado" del panel de pedidos activos. | |
| | 2- El sistema muestra el detalle del pedido con la acción disponible: Marcar como En camino. |
| 3- El distribuidor confirma la acción de marcar el pedido como "En camino". | |
| | 4- El sistema cambia el estado del pedido a "En camino" y envía una notificación al comprador con el número de pedido y el nuevo estado (RF-029). |

**Curso Alterno**

[A1] En el paso 1, si el distribuidor selecciona un pedido en estado "En camino":
  1. El sistema muestra el detalle del pedido con la acción disponible: Marcar como Entregado.
  2. El distribuidor confirma la acción de marcar el pedido como "Entregado".
  3. El sistema cambia el estado a "Entregado", descuenta definitivamente el stock reservado del inventario y envía una notificación al comprador habilitando la opción de calificar al distribuidor (RF-033).
  El caso de uso termina.

[E1] En el paso 4 o en el paso 3 del [A1], si ocurre un error al actualizar el estado:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-33 — Consultar historial de pedidos del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar historial de pedidos del distribuidor |
| **Requerimiento Funcional** | RF-031 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor accede al historial completo de todos los pedidos recibidos por su distribuidora, incluyendo los finalizados. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El distribuidor visualiza el historial completo de pedidos con número, fecha de creación, estado actual, nombre del comprador, número de teléfono y lista de productos con cantidad en la unidad del producto. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor revisar todos los pedidos recibidos en cualquier estado, incluyendo los entregados, rechazados y cancelados. Si no tiene pedidos registrados, el sistema lo indica. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de historial de pedidos. | |
| | 2- El sistema recupera todos los pedidos recibidos por el distribuidor en todos sus estados y muestra el historial completo. Para cada pedido presenta: número de pedido, fecha de creación, estado actual, nombre del comprador, número de teléfono del comprador y lista de productos solicitados con cantidad en la unidad del producto. |
| 3- El distribuidor consulta el historial para revisar pedidos anteriores. | |

**Curso Alterno**

[A1] En el paso 2, si el distribuidor no tiene pedidos registrados:
  1. El sistema muestra el mensaje "Aún no recibiste pedidos."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar el historial:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-34 — Consultar historial de pedidos del comprador

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar historial de pedidos del comprador |
| **Requerimiento Funcional** | RF-032 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador accede al historial completo de todos sus pedidos realizados, incluyendo los finalizados en cualquier estado. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. |
| **Post condición** | El comprador visualiza el historial completo de sus pedidos con número, nombre del distribuidor, fecha de creación, estado actual y lista de productos con cantidad en la unidad del producto. |
| **Importancia** | Esencial |
| **Resumen** | Permite al comprador revisar todos los pedidos que ha realizado en el sistema. Desde este historial puede acceder al detalle de cada pedido individual (CU-58). Si no tiene pedidos, el sistema lo indica. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede a la sección de historial de pedidos. | |
| | 2- El sistema recupera todos los pedidos realizados por el comprador en todos sus estados y muestra el historial completo. Para cada pedido presenta: número de pedido, nombre del distribuidor, fecha de creación, estado actual y lista de productos con cantidad en la unidad del producto. |
| 3- El comprador consulta el historial para revisar sus pedidos anteriores. | |

**Curso Alterno**

[A1] En el paso 2, si el comprador no tiene pedidos registrados:
  1. El sistema muestra el mensaje "Aún no realizaste pedidos."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar el historial:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-35 — Calificar distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Calificar distribuidor |
| **Requerimiento Funcional** | RF-033 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador califica al distribuidor luego de que un pedido de ese distribuidor fue marcado como "Entregado". La calificación queda visible en el perfil público del distribuidor. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. Tiene al menos un pedido en estado "Entregado" del distribuidor al que desea calificar, y aún no lo ha calificado. |
| **Post condición** | La calificación queda registrada y no puede modificarse. El promedio de calificaciones del distribuidor se recalcula de forma inmediata y queda visible en su perfil público (CU-04). |
| **Importancia** | Deseable |
| **Resumen** | Habilita al comprador a evaluar la experiencia de entrega de un distribuidor. Solo puede calificarse una vez por pedido entregado. La calificación promedio del distribuidor se actualiza automáticamente al registrarse. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador accede al detalle de un pedido en estado "Entregado" desde su historial (CU-58). | |
| | 2- El sistema verifica que el pedido está en estado "Entregado" y que el comprador no ha calificado este pedido previamente, y muestra el módulo de calificación habilitado. |
| 3- El comprador ingresa su calificación y la envía. | |
| | 4- El sistema registra la calificación, recalcula el promedio del distribuidor, actualiza el valor visible en el perfil público y confirma al comprador que la calificación fue registrada, desactivando el módulo de calificación para ese pedido. |

**Curso Alterno**

[A1] En el paso 2, si el comprador ya calificó este pedido:
  1. El sistema muestra la calificación previamente enviada sin habilitar el módulo de calificación.
  El caso de uso termina.

[A2] En el paso 2, si el pedido no está en estado "Entregado":
  1. El sistema no muestra el módulo de calificación.
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al registrar la calificación:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-36 — Registrar proveedor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Registrar proveedor |
| **Requerimiento Funcional** | RF-034 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor registra un nuevo proveedor en el sistema ingresando su nombre y número de teléfono de WhatsApp. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El proveedor queda registrado y aparece en el listado de proveedores del distribuidor, disponible para armar pedidos de reposición dirigidos a él. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor registrar los proveedores a quienes les realiza pedidos de reposición. El nombre y el teléfono son obligatorios. El teléfono registrado es el que el sistema usará para generar los mensajes de WhatsApp de reposición. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de gestión de proveedores y selecciona la opción de registrar nuevo proveedor. | |
| | 2- El sistema muestra el formulario de registro con los campos: nombre del proveedor y número de teléfono de WhatsApp. |
| 3- El distribuidor completa ambos campos y confirma el registro. | |
| | 4- El sistema valida que ningún campo esté vacío, registra el proveedor y lo muestra en el listado de proveedores del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si alguno de los campos obligatorios está vacío:
  1. El sistema muestra el mensaje "El nombre y el teléfono del proveedor son obligatorios." y no registra el proveedor.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al guardar el proveedor:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-37 — Editar proveedor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Editar proveedor |
| **Requerimiento Funcional** | RF-035 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor edita el nombre o el número de teléfono de WhatsApp de un proveedor ya registrado. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un proveedor registrado (CU-36 completado). |
| **Post condición** | Los datos del proveedor quedan actualizados con los nuevos valores ingresados. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor mantener actualizados los datos de contacto de sus proveedores. Tanto el nombre como el teléfono son obligatorios y no pueden quedar vacíos tras la edición. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al listado de proveedores (CU-38) y selecciona uno para editar. | |
| | 2- El sistema muestra el formulario de edición con los datos actuales del proveedor: nombre y número de teléfono de WhatsApp. |
| 3- El distribuidor modifica los campos deseados y confirma los cambios. | |
| | 4- El sistema valida que ni el nombre ni el teléfono queden vacíos, actualiza el proveedor y muestra la confirmación al distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el nombre queda vacío:
  1. El sistema muestra el mensaje "El nombre del proveedor no puede quedar vacío." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si el teléfono queda vacío:
  1. El sistema muestra el mensaje "El teléfono del proveedor no puede quedar vacío." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si ocurre un error al guardar los cambios:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-38 — Consultar lista de proveedores

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar lista de proveedores |
| **Requerimiento Funcional** | RF-058 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor accede al listado de proveedores registrados para su distribuidora, desde donde puede iniciar el armado de pedidos de reposición. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El distribuidor visualiza el listado de sus proveedores registrados con nombre y número de teléfono de WhatsApp. Tiene disponible la opción de iniciar un pedido de reposición para cualquiera de ellos. |
| **Importancia** | Deseable |
| **Resumen** | Punto de entrada para la gestión de proveedores. Muestra nombre y teléfono de cada proveedor registrado y permite acceder al armado de pedidos de reposición (CU-39) y a la edición de sus datos (CU-37). Si no hay proveedores registrados, ofrece acceso directo al registro de uno nuevo. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de gestión de proveedores. | |
| | 2- El sistema recupera los proveedores registrados para esa distribuidora y muestra el listado completo con nombre y número de teléfono de WhatsApp para cada uno, y las opciones de editar (CU-37) e iniciar un pedido de reposición por proveedor (CU-39). |
| 3- El distribuidor consulta el listado para seleccionar un proveedor o gestionar los existentes. | |

**Curso Alterno**

[A1] En el paso 2, si el distribuidor no tiene proveedores registrados:
  1. El sistema muestra el mensaje "Aún no registraste proveedores." y ofrece acceso directo a CU-36 para registrar el primero.
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar los proveedores:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-39 — Armar pedido de reposición

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Armar pedido de reposición |
| **Requerimiento Funcional** | RF-036 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor selecciona productos de su catálogo y especifica la cantidad requerida de cada uno para armar un pedido de reposición destinado a un proveedor registrado. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un proveedor registrado en el sistema (CU-36 completado). |
| **Post condición** | El pedido de reposición queda registrado como borrador listo para ser confirmado y enviado al proveedor (CU-40). |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor preparar un pedido de reposición seleccionando los productos que necesita reabastecer y las cantidades solicitadas. El pedido queda en estado de borrador hasta que el distribuidor lo confirme y lo envíe al proveedor por WhatsApp. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un proveedor del listado (CU-38) y elige la opción de crear un nuevo pedido de reposición. | |
| | 2- El sistema muestra el formulario de armado del pedido con el listado de productos del catálogo del distribuidor disponibles para seleccionar. |
| 3- El distribuidor selecciona uno o más productos y especifica la cantidad requerida de cada uno. | |
| | 4- El sistema valida que se seleccionó al menos un producto y que todas las cantidades ingresadas son mayores a cero, registra el pedido de reposición como borrador y lo presenta al distribuidor listo para confirmar. |

**Curso Alterno**

[E1] En el paso 4, si el distribuidor no seleccionó ningún producto:
  1. El sistema muestra el mensaje "Agregá al menos un producto antes de continuar." y no crea el pedido.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si alguna cantidad ingresada es igual a cero o negativa:
  1. El sistema muestra el mensaje "La cantidad debe ser mayor a cero." en el campo correspondiente y no crea el pedido.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si ocurre un error al registrar el borrador:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-40 — Confirmar pedido de reposición por WhatsApp

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Confirmar pedido de reposición por WhatsApp |
| **Requerimiento Funcional** | RF-037 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor confirma un pedido de reposición armado, lo que hace que el sistema abra WhatsApp con un mensaje pre-redactado dirigido al proveedor. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido de reposición en estado de borrador (CU-39 completado). |
| **Post condición** | WhatsApp se abre en el dispositivo del distribuidor con un mensaje pre-redactado dirigido al número de teléfono del proveedor, incluyendo la lista de productos y cantidades del pedido de reposición. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor enviar el pedido de reposición a su proveedor a través de WhatsApp. El sistema genera automáticamente el mensaje con el detalle del pedido y lo abre mediante un deep link (wa.me) en el dispositivo del distribuidor. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor revisa el borrador del pedido de reposición y selecciona la opción de confirmar. | |
| | 2- El sistema genera un mensaje pre-redactado con la lista de productos y cantidades del pedido. |
| 3- El distribuidor confirma el envío del pedido de reposición al proveedor. | |
| | 4- El sistema genera un deep link de WhatsApp (wa.me) con el mensaje pre-redactado dirigido al número de teléfono del proveedor registrado, y lo abre en el dispositivo del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si ocurre un error al generar el deep link:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-41 — Registrar precio por volumen del proveedor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Registrar precio por volumen del proveedor |
| **Requerimiento Funcional** | RF-038 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor registra el precio de costo que un proveedor aplica a un producto de su catálogo a partir de una cantidad mínima de compra, como referencia para el análisis de rentabilidad. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. El proveedor está registrado en el sistema (CU-36 completado). El producto pertenece al catálogo del distribuidor. |
| **Post condición** | El precio por volumen del proveedor queda registrado y asociado al proveedor y al producto correspondientes, disponible como referencia para el cálculo de rentabilidad y para futuras recomendaciones de compra. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor llevar un registro de cuánto le cuesta cada producto según el proveedor y la cantidad comprada. El precio de costo no puede ser negativo y la cantidad mínima de aplicación debe ser mayor a cero. Esta información es independiente de los precios por volumen de venta al comprador (CU-17). |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor selecciona un proveedor (CU-38) y un producto de su catálogo, y elige la opción de registrar un nuevo precio por volumen del proveedor. | |
| | 2- El sistema muestra el formulario con los campos: cantidad mínima de aplicación y precio de costo por unidad. |
| 3- El distribuidor completa los campos y confirma el registro. | |
| | 4- El sistema valida que el precio de costo no es negativo y que la cantidad mínima de aplicación es mayor a cero, y registra el precio por volumen del proveedor, asociándolo al proveedor y al producto correspondientes. |

**Curso Alterno**

[E1] En el paso 4, si el precio de costo es negativo:
  1. El sistema muestra el mensaje "El precio de costo no puede ser negativo." y no registra el precio.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si la cantidad mínima de aplicación es cero o negativa:
  1. El sistema muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no registra el precio.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si ocurre un error al guardar el registro:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-42 — Consultar dashboard de rendimiento

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar dashboard de rendimiento |
| **Requerimiento Funcional** | RF-039, RF-041 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor accede al dashboard de reportes para visualizar indicadores de rendimiento de su negocio para un período seleccionado: total facturado, cantidad de pedidos entregados y los productos más y menos vendidos. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El distribuidor visualiza el dashboard con todos los indicadores calculados para el período seleccionado (día actual, semana actual o mes actual). El período predeterminado es el mes actual. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor evaluar el rendimiento de su negocio consultando métricas agregadas de ventas. El período puede cambiarse entre día actual, semana actual y mes actual. Todos los indicadores se recalculan al cambiar el período. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de reportes del panel. | |
| | 2- El sistema calcula los indicadores para el período del mes actual (período predeterminado) y muestra el dashboard con: total facturado, cantidad de pedidos en estado "Entregado", listado de productos más vendidos por unidades y listado de productos menos vendidos por unidades. |
| 3- El distribuidor selecciona un período diferente (día actual o semana actual). | |
| | 4- El sistema recalcula todos los indicadores del dashboard para el período seleccionado y actualiza la vista. |

**Curso Alterno**

[A1] En el paso 2 o en el paso 4, si no existen pedidos en estado "Entregado" para el período seleccionado:
  1. El sistema muestra el dashboard con todos los indicadores en cero o vacíos con el mensaje "No hay pedidos completados en el período seleccionado."
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al calcular los indicadores:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-43 — Consultar rentabilidad por precio por volumen

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar rentabilidad por precio por volumen |
| **Requerimiento Funcional** | RF-040 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor consulta el cálculo de rentabilidad de cada precio por volumen de sus productos, expresado en pesos uruguayos y en porcentaje sobre el precio de costo. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Tiene al menos un precio por volumen registrado (CU-17 completado). |
| **Post condición** | El distribuidor visualiza para cada precio por volumen con precio de costo registrado: precio de costo, precio de venta, diferencia en pesos uruguayos y diferencia en porcentaje. Los precios por volumen sin precio de costo muestran un indicador de dato faltante. |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor evaluar la rentabilidad bruta de cada precio por volumen de sus productos. El cálculo solo aplica a precios por volumen con precio de costo registrado. Los que no lo tienen muestran el indicador "—" con el texto "Sin precio de costo". |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de rentabilidad en el panel de reportes. | |
| | 2- El sistema calcula la rentabilidad de cada precio por volumen que tiene precio de costo registrado (diferencia en pesos uruguayos y en porcentaje sobre el precio de costo) y muestra el listado de productos con sus precios por volumen, indicando para cada uno los valores calculados. Los precios por volumen sin precio de costo registrado muestran el indicador "—" con el texto "Sin precio de costo". |
| 3- El distribuidor consulta los indicadores de rentabilidad de sus precios por volumen. | |

**Curso Alterno**

[E1] En el paso 2, si ocurre un error al calcular la rentabilidad:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-44 — Crear empleado

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Crear empleado |
| **Requerimiento Funcional** | RF-042 |
| **Versión** | 1.2 |
| **Actor** | Distribuidor |
| **Descripción** | El administrador del distribuidor crea una cuenta de empleado ingresando los datos del empleado y asignando un rol fijo. El sistema genera una contraseña por defecto y la envía al empleado por SMS junto con su cédula de identidad como dato de acceso. |
| **Precondición** | El actor tiene una sesión activa en el panel del distribuidor con rol de Administrador. |
| **Post condición** | La cuenta del empleado queda creada en el sistema con el rol asignado. El empleado recibe por SMS su cédula de identidad y contraseña por defecto. En su primer inicio de sesión, deberá cambiar esa contraseña (CU-46). |
| **Importancia** | Deseable |
| **Resumen** | Permite incorporar empleados al panel del distribuidor asignando uno de los dos roles disponibles: Administrador (acceso completo al panel, incluida la gestión de empleados) u Operador (gestión de pedidos y stock, sin acceso a configuración del negocio ni a gestión de empleados). La cédula de identidad es única en el sistema. El sistema genera la contraseña inicial y la envía por SMS junto con la cédula. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El administrador accede a la sección de gestión de empleados y selecciona la opción de crear nuevo empleado. | |
| | 2- El sistema muestra el formulario con los campos: nombre completo, número de cédula de identidad, número de teléfono y rol a asignar (Administrador u Operador). |
| 3- El administrador completa todos los campos obligatorios, selecciona el rol y confirma la creación. | |
| | 4- El sistema valida que todos los campos obligatorios están completados y que la cédula de identidad no está registrada previamente; crea la cuenta del empleado con el rol asignado, genera una contraseña por defecto y envía por SMS al número de teléfono del empleado su cédula de identidad y la contraseña generada. |

**Curso Alterno**

[E1] En el paso 4, si la cédula de identidad ya está registrada en el sistema:
  1. El sistema muestra el mensaje "Ya existe un empleado registrado con esa cédula de identidad." y no crea el empleado.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si algún campo obligatorio está vacío:
  1. El sistema muestra el mensaje "Completá todos los campos obligatorios antes de continuar." y no crea el empleado.
  El flujo continúa en el paso 3.

[E3] En el paso 4, si ocurre un error al enviar el SMS:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-45 — Iniciar sesión como empleado

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Iniciar sesión como empleado |
| **Requerimiento Funcional** | RF-043 |
| **Versión** | 1.2 |
| **Actor** | Empleado |
| **Descripción** | El empleado inicia sesión en el sistema ingresando su número de cédula de identidad y contraseña, accediendo al panel con las funciones que corresponden a su rol asignado. |
| **Precondición** | El empleado tiene una cuenta activa creada por el administrador del distribuidor (CU-44 completado). La cuenta no está desactivada. |
| **Post condición** | El sistema inicia la sesión del empleado con las funciones de su rol (Administrador u Operador). Si es el primer inicio de sesión, el sistema redirige al empleado al flujo de cambio de contraseña obligatorio (CU-46) antes de dar acceso a cualquier otra función. |
| **Importancia** | Deseable |
| **Resumen** | Permite al empleado de una distribuidora acceder al sistema con credenciales propias. En el primer acceso, el sistema obliga a cambiar la contraseña por defecto antes de permitir el uso del panel. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El empleado ingresa su número de cédula de identidad y contraseña en el formulario de inicio de sesión. | |
| | 2- El sistema valida que la cédula está registrada, que la cuenta está activa y que la contraseña corresponde, y verifica si es el primer inicio de sesión del empleado. |
| 3- El empleado accede al panel con las funciones correspondientes a su rol asignado. | |

**Curso Alterno**

[A1] En el paso 3, si es el primer inicio de sesión del empleado:
  1. El sistema redirige al empleado al flujo obligatorio de cambio de contraseña (CU-46) antes de dar acceso a cualquier función.
  El caso de uso termina.

[E1] En el paso 2, si la cédula o la contraseña son incorrectas:
  1. El sistema muestra el mensaje "La cédula o la contraseña son incorrectas."
  El flujo continúa en el paso 1.

[E2] En el paso 2, si la cuenta del empleado está desactivada:
  1. El sistema muestra el mensaje "Tu cuenta está desactivada. Contactá al administrador de tu distribuidora." y no inicia la sesión.
  El caso de uso termina.

---

### CU-46 — Cambiar contraseña en primer acceso del empleado

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Cambiar contraseña en primer acceso del empleado |
| **Requerimiento Funcional** | RF-044 |
| **Versión** | 1.1 |
| **Actor** | Empleado |
| **Descripción** | El empleado establece una nueva contraseña personal en reemplazo de la contraseña por defecto asignada al crear su cuenta, como paso obligatorio en su primer inicio de sesión. |
| **Precondición** | El empleado completó el inicio de sesión con la contraseña por defecto (CU-45) y es su primer acceso al sistema. |
| **Post condición** | La contraseña por defecto queda reemplazada por la nueva contraseña personal. El empleado obtiene acceso al panel del distribuidor con las funciones de su rol. |
| **Importancia** | Deseable |
| **Resumen** | El sistema obliga al empleado a reemplazar su contraseña provisoria antes de acceder a cualquier función del panel. La nueva contraseña no puede ser igual a la contraseña por defecto. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| | 1- El sistema presenta al empleado el formulario de cambio de contraseña obligatorio al completar el primer inicio de sesión. |
| 2- El empleado ingresa una nueva contraseña diferente a la contraseña por defecto. | |
| | 3- El sistema valida que la nueva contraseña es distinta a la contraseña por defecto, actualiza la contraseña y concede acceso al panel del distribuidor con las funciones de su rol. |

**Curso Alterno**

[E1] En el paso 3, si la nueva contraseña ingresada es igual a la contraseña por defecto:
  1. El sistema muestra el mensaje "La nueva contraseña no puede ser igual a la contraseña provisoria. Elegí una diferente." y no actualiza la contraseña.
  El flujo continúa en el paso 2.

[E2] En el paso 3, si ocurre un error al actualizar la contraseña:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-47 — Exportar datos del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Exportar datos del distribuidor |
| **Requerimiento Funcional** | RF-045 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor selecciona uno o más conjuntos de datos de su negocio para descargar en un archivo CSV compatible con Microsoft Excel y Google Sheets. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | El sistema genera y descarga en el dispositivo del distribuidor un archivo CSV con los datos seleccionados, en codificación UTF-8. |
| **Importancia** | Opcional |
| **Resumen** | Permite al distribuidor exportar sus datos de pedidos, productos o stock en formato CSV estándar. El distribuidor puede seleccionar uno o más conjuntos de datos en una misma exportación. Al menos un conjunto debe estar seleccionado para habilitar la descarga. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede a la sección de exportación de datos. | |
| | 2- El sistema muestra las opciones de conjuntos de datos disponibles para exportar: Pedidos (historial completo), Productos (catálogo con precios por volumen) y Stock (estado actual del inventario). |
| 3- El distribuidor selecciona uno o más conjuntos de datos y confirma la exportación. | |
| | 4- El sistema valida que al menos un conjunto fue seleccionado, genera el archivo CSV con codificación UTF-8 que incluye los datos seleccionados y lo descarga en el dispositivo del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el distribuidor no seleccionó ningún conjunto de datos:
  1. El sistema muestra el mensaje "Seleccioná al menos un conjunto de datos para exportar." y no genera el archivo.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al generar el archivo:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-48 — Registrar dirección de partida del depósito

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Registrar dirección de partida del depósito |
| **Requerimiento Funcional** | RF-046 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor registra la dirección de partida de su depósito o punto de salida, que el sistema usará como referencia geográfica para la planificación de rutas de reparto. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. |
| **Post condición** | La dirección de partida queda registrada en el perfil de configuración del distribuidor y el sistema la usará como punto de origen en el cálculo del plan de carga (CU-50). |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor establecer el punto de origen de sus repartos. Es un requisito previo para generar el plan de carga de rutas. La dirección no puede estar vacía. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de configuración y selecciona la opción de registrar la dirección de partida del depósito. | |
| | 2- El sistema muestra el campo para ingresar la dirección de partida con el valor actual registrado (si existe). |
| 3- El distribuidor ingresa la dirección de partida del depósito y confirma el registro. | |
| | 4- El sistema valida que el campo no está vacío, registra la dirección y la muestra en el panel de configuración del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el campo de dirección está vacío:
  1. El sistema muestra el mensaje "Ingresá la dirección de partida antes de guardar." y no registra la dirección.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al guardar la dirección:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-49 — Seleccionar pedidos para planificación de reparto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Seleccionar pedidos para planificación de reparto |
| **Requerimiento Funcional** | RF-047 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor selecciona, entre los pedidos en estado "Aceptado" con dirección de entrega registrada, cuáles incluir en una nueva planificación de reparto. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en estado "Aceptado" con dirección de entrega registrada. La dirección de partida del depósito está configurada (CU-48 completado). |
| **Post condición** | Los pedidos seleccionados (mínimo dos) quedan listos para generar el plan de carga (CU-50). El sistema habilita el control de generación del plan. |
| **Importancia** | Deseable |
| **Resumen** | Primer paso del flujo de planificación de reparto: el distribuidor elige qué pedidos incluir en la ruta del día. Solo se pueden seleccionar pedidos en estado "Aceptado" con dirección de entrega. Se requieren al menos dos pedidos para habilitar la generación del plan. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al módulo de planificación de reparto. | |
| | 2- El sistema muestra el listado de pedidos en estado "Aceptado" que tienen dirección de entrega registrada, disponibles para incluir en la planificación. |
| 3- El distribuidor selecciona dos o más pedidos de la lista para incluir en la planificación. | |
| | 4- El sistema valida que se seleccionaron al menos dos pedidos válidos y habilita el control de generación del plan de carga. |

**Curso Alterno**

[A1] En el paso 2, si no existen pedidos en estado "Aceptado" con dirección de entrega registrada:
  1. El sistema muestra el mensaje "No hay pedidos aceptados con dirección de entrega registrada."
  El caso de uso termina.

[E1] En el paso 4, si el distribuidor seleccionó menos de dos pedidos:
  1. El sistema muestra el mensaje "Seleccioná al menos dos pedidos para generar la planificación." y no habilita la generación.
  El flujo continúa en el paso 3.

---

### CU-50 — Generar plan de carga

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Generar plan de carga |
| **Requerimiento Funcional** | RF-048 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor solicita la generación del plan de carga del camión. El sistema ordena los pedidos seleccionados de mayor a menor distancia desde la dirección de partida del depósito, utilizando inteligencia artificial. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. Se seleccionaron al menos dos pedidos válidos en CU-49. La dirección de partida del depósito está registrada (CU-48 completado). |
| **Post condición** | El plan de carga queda generado con los pedidos ordenados de mayor a menor distancia desde el depósito. El sistema muestra la lista de reparto resultante (CU-51). |
| **Importancia** | Deseable |
| **Resumen** | Segundo paso del flujo de planificación: el distribuidor genera el orden de carga y entrega de los pedidos. El sistema aplica un modelo de IA para calcular el orden óptimo por distancia. Si la dirección de partida no está registrada, el sistema bloquea la generación. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor confirma los pedidos seleccionados y solicita generar el plan de carga. | |
| | 2- El sistema verifica que la dirección de partida del depósito está registrada y que hay al menos dos pedidos seleccionados con dirección de entrega, aplica el modelo de inteligencia artificial para ordenar los pedidos de mayor a menor distancia desde la dirección de partida, y genera el plan de carga con los pedidos ordenados. |
| 3- El distribuidor consulta el plan de carga generado. | |
| | 4- El sistema presenta la lista de reparto resultante (CU-51). |

**Curso Alterno**

[E1] En el paso 2, si la dirección de partida del distribuidor no está registrada:
  1. El sistema muestra el mensaje "Registrá la dirección de partida del depósito antes de generar el plan." y no genera el plan.
  El caso de uso termina.

[E2] En el paso 2, si ocurre un error al calcular el plan:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-51 — Visualizar lista de reparto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Visualizar lista de reparto |
| **Requerimiento Funcional** | RF-049 |
| **Versión** | 1.1 |
| **Actor** | Empleado |
| **Descripción** | El empleado consulta la lista de clientes en el orden de entrega resultante del plan de carga generado, con acceso a los datos de cada parada y a la ruta en Google Maps. |
| **Precondición** | El empleado tiene una sesión activa en el sistema. Existe un plan de reparto generado y activo (CU-50 completado). |
| **Post condición** | El empleado visualiza el listado completo de paradas en el orden de entrega planificado. Para cada parada tiene disponible el acceso a la ruta en Google Maps. |
| **Importancia** | Deseable |
| **Resumen** | Permite al empleado consultar la hoja de ruta del día con los clientes ordenados según el plan de carga. Para cada parada muestra nombre del comprador, dirección de entrega, productos del pedido con cantidad en la unidad del producto, y acceso a la ruta en Google Maps. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El empleado accede al módulo de planificación de reparto. | |
| | 2- El sistema muestra el plan de reparto activo con la lista completa de clientes en el orden de entrega calculado. Para cada parada presenta: nombre del comprador, dirección de entrega y lista de productos del pedido con cantidad en la unidad del producto. |
| 3- El empleado selecciona la opción de ver la ruta para una parada específica. | |
| | 4- El sistema genera el enlace a Google Maps con la dirección del cliente seleccionado como destino y lo abre en el dispositivo del empleado. |

**Curso Alterno**

[E1] En el paso 2, si ocurre un error al recuperar el plan de reparto activo:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-52 — Marcar parada en plan de reparto

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Marcar parada en plan de reparto |
| **Requerimiento Funcional** | RF-050 |
| **Versión** | 1.1 |
| **Actor** | Empleado |
| **Descripción** | El empleado registra el resultado de una parada del plan de reparto activo marcándola como Entregado, Omitido o Rechazado. Según la acción elegida, el sistema actualiza el estado del pedido correspondiente en el sistema principal. |
| **Precondición** | El empleado tiene una sesión activa en el sistema. El plan de reparto está activo. La parada a marcar no fue marcada previamente. |
| **Post condición** | La parada queda marcada y no puede desmarcarse desde la interfaz de planificación. Si fue marcada como Entregado, el pedido pasa a estado "Entregado" y el stock reservado se descuenta. Si fue marcada como Rechazado, el pedido pasa a estado "Rechazado" con motivo "Rechazado en entrega" y el stock reservado se libera. Si fue marcada como Omitido, el pedido permanece sin cambios. |
| **Importancia** | Deseable |
| **Resumen** | Permite al empleado registrar el resultado de cada entrega en tiempo real. Las acciones son irreversibles desde la interfaz de reparto. El marcado como Entregado o Rechazado actualiza el estado del pedido en el sistema principal y notifica al comprador. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El empleado consulta la lista de reparto activa (CU-51) y selecciona una parada pendiente. | |
| | 2- El sistema muestra las opciones disponibles para esa parada: Entregado, Omitido, Rechazado. |
| 3- El empleado selecciona la acción "Entregado" y confirma. | |
| | 4- El sistema actualiza el estado del pedido correspondiente a "Entregado" en el sistema principal, descuenta el stock reservado del inventario y envía una notificación al comprador con el nuevo estado del pedido. La parada queda marcada en la lista de reparto como completada. |

**Curso Alterno**

[A1] En el paso 3, si el empleado selecciona la acción "Omitido":
  1. El sistema registra la parada como omitida en la lista de reparto y mantiene el estado del pedido en el sistema principal sin cambios.
  El caso de uso termina.

[A2] En el paso 3, si el empleado selecciona la acción "Rechazado":
  1. El sistema actualiza el estado del pedido correspondiente a "Rechazado" en el sistema principal, registra el motivo "Rechazado en entrega" y libera el stock reservado.
  El caso de uso termina.

[E1] En el paso 4, si ocurre un error al actualizar el estado del pedido:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-53 — Cerrar sesión

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Cerrar sesión |
| **Requerimiento Funcional** | RF-051 |
| **Versión** | 1.0 |
| **Actor** | Empleado |
| **Descripción** | El usuario autenticado cierra su sesión activa en el sistema mediante un control visible en la interfaz. |
| **Precondición** | El usuario tiene una sesión activa en el sistema (como comprador, distribuidor o empleado). |
| **Post condición** | La sesión activa queda invalidada de forma inmediata. Los datos de sesión son eliminados del dispositivo. El usuario es redirigido a la pantalla de inicio de sesión. El carrito del comprador se conserva para cuando vuelva a iniciar sesión. |
| **Importancia** | Esencial |
| **Resumen** | Permite a cualquier usuario autenticado cerrar su sesión de forma segura. La sesión se invalida inmediatamente. Este UC aplica a compradores, distribuidores y empleados por igual; el actor primario documentado es Empleado como representante del rol más específico, siendo aplicable a todos los roles autenticados. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El usuario selecciona la opción de cerrar sesión desde el control visible en la interfaz. | |
| | 2- El sistema invalida la sesión activa del usuario de forma inmediata, elimina los datos de sesión del dispositivo y redirige al usuario a la pantalla de inicio de sesión. |
| 3- El usuario llega a la pantalla de inicio de sesión con la sesión cerrada. | |

**Curso Alterno**

[E1] En el paso 2, si ocurre un error al invalidar la sesión:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-54 — Configurar perfil inicial del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Configurar perfil inicial del distribuidor |
| **Requerimiento Funcional** | RF-052 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El usuario configura su perfil de distribuidor por primera vez tras activar el modo distribuidor (CU-14), registrando el nombre comercial, descripción del negocio y zona de entrega. |
| **Precondición** | El usuario activó el modo distribuidor en su cuenta (CU-14 completado). Es la primera vez que accede al panel del distribuidor. |
| **Post condición** | El perfil del distribuidor queda configurado con los datos ingresados. El usuario obtiene acceso al panel del distribuidor. El perfil es visible públicamente (CU-04). |
| **Importancia** | Esencial |
| **Resumen** | Paso inicial obligatorio para operar como distribuidor. El usuario no puede acceder al panel del distribuidor hasta completar este formulario. El nombre comercial es obligatorio; sin él el sistema bloquea el avance. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| | 1- El sistema presenta al usuario el formulario de configuración inicial del perfil de distribuidor inmediatamente después de activar el modo distribuidor (CU-14). |
| 2- El usuario completa los campos: nombre comercial, descripción del negocio y zona de entrega. | |
| | 3- El sistema valida que el nombre comercial no está vacío, registra el perfil del distribuidor y concede acceso al panel del distribuidor. |

**Curso Alterno**

[E1] En el paso 3, si el nombre comercial está vacío:
  1. El sistema muestra el mensaje "El nombre comercial es obligatorio para continuar." y no avanza al panel del distribuidor.
  El flujo continúa en el paso 2.

[E2] En el paso 3, si ocurre un error al guardar el perfil:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-55 — Editar perfil del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Editar perfil del distribuidor |
| **Requerimiento Funcional** | RF-053 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor actualiza los datos de su perfil público desde el panel de configuración: nombre comercial, descripción del negocio y zona de entrega. |
| **Precondición** | El distribuidor tiene una sesión activa en modo distribuidor. El perfil ya fue configurado previamente (CU-54 completado). |
| **Post condición** | El perfil queda actualizado con los nuevos datos. Los cambios se reflejan de inmediato en el perfil público del distribuidor visible a cualquier usuario (CU-04). |
| **Importancia** | Deseable |
| **Resumen** | Permite al distribuidor mantener actualizada la información pública de su negocio. El nombre comercial no puede quedar vacío. Los cambios son inmediatamente visibles en el perfil público. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El distribuidor accede al panel de configuración del perfil y selecciona la opción de editar. | |
| | 2- El sistema muestra el formulario de edición con los datos actuales del perfil: nombre comercial, descripción del negocio y zona de entrega. |
| 3- El distribuidor modifica los campos deseados y confirma los cambios. | |
| | 4- El sistema valida que el nombre comercial no quedó vacío, aplica los cambios y los refleja de inmediato en el perfil público del distribuidor. |

**Curso Alterno**

[E1] En el paso 4, si el nombre comercial quedó vacío:
  1. El sistema muestra el mensaje "El nombre comercial no puede quedar vacío." y no aplica los cambios.
  El flujo continúa en el paso 3.

[E2] En el paso 4, si ocurre un error al guardar los cambios:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-56 — Recuperar contraseña del empleado

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Recuperar contraseña del empleado |
| **Requerimiento Funcional** | RF-054 |
| **Versión** | 1.0 |
| **Actor** | Empleado |
| **Descripción** | El empleado que no recuerda su contraseña solicita un código SMS al número de teléfono registrado en su cuenta para verificar su identidad y establecer una nueva contraseña. |
| **Precondición** | El empleado tiene una cuenta activa en el sistema. |
| **Post condición** | La contraseña queda actualizada con el nuevo valor ingresado. El código de recuperación queda inválido. El empleado es redirigido al inicio de sesión. |
| **Importancia** | Deseable |
| **Resumen** | Permite al empleado recuperar el acceso a su cuenta mediante un código SMS enviado al teléfono registrado por el administrador. Tras ingresar el código correcto dentro del período de 10 minutos de validez, puede definir una nueva contraseña. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El empleado ingresa su número de cédula de identidad en el formulario de recuperación de contraseña. | |
| | 2- El sistema valida que la cédula corresponde a una cuenta activa y envía un código de verificación por SMS al número de teléfono registrado para ese empleado. El código tiene validez de 10 minutos. |
| 3- El empleado ingresa el código de verificación recibido por SMS. | |
| | 4- El sistema valida que el código es correcto y habilita el campo para ingresar la nueva contraseña. |
| 5- El empleado ingresa y confirma la nueva contraseña. | |
| | 6- El sistema actualiza la contraseña, invalida el código de recuperación y redirige al empleado al inicio de sesión con el mensaje "Tu contraseña fue actualizada correctamente." |

**Curso Alterno**

[E1] En el paso 2, si la cédula no corresponde a ninguna cuenta registrada:
  1. El sistema muestra el mensaje "No encontramos un empleado con esa cédula de identidad."
  El caso de uso termina.

[E2] En el paso 4, si el código SMS ingresado es incorrecto:
  1. El sistema muestra el mensaje "El código ingresado no es válido. Intentá de nuevo."
  El flujo continúa en el paso 3.

[E3] En el paso 4, si el código SMS venció (pasaron más de 10 minutos):
  1. El sistema muestra el mensaje "El código expiró. Solicitá uno nuevo." y habilita la opción de solicitar un nuevo código.
  El flujo continúa en el paso 1.

---

### CU-57 — Gestionar lista de empleados

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Gestionar lista de empleados |
| **Requerimiento Funcional** | RF-059 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El administrador del distribuidor consulta el listado de empleados creados para su distribuidora, con sus datos básicos, rol asignado y estado de cuenta, y desde esa misma vista desactiva o reactiva la cuenta de cualquiera de ellos. |
| **Precondición** | El actor tiene una sesión activa en el panel del distribuidor con rol de Administrador. |
| **Post condición** | El actor visualiza el listado completo de empleados de la distribuidora. Si cambió el estado de cuenta de alguno, ese estado queda actualizado de forma inmediata: si fue desactivada, el empleado pierde el acceso al sistema; si fue reactivada, recupera el acceso con los permisos de su rol sin necesidad de volver a configurarlos. El registro histórico de acciones se conserva en ambos casos. |
| **Importancia** | Deseable |
| **Resumen** | Permite ver todos los empleados de la distribuidora con su rol y estado de cuenta, y controlar su acceso al panel sin eliminar sus datos ni su historial. Tanto la desactivación como la reactivación son inmediatas. Si no hay empleados registrados, ofrece acceso directo a crear el primero. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El administrador accede a la sección de gestión de empleados. | |
| | 2- El sistema recupera el listado de empleados de la distribuidora y muestra el listado completo. Para cada empleado presenta: nombre completo, número de cédula de identidad, rol asignado (Administrador / Operador) y estado de la cuenta (activa/desactivada). |
| 3- El administrador identifica un empleado y selecciona la acción de desactivar su cuenta. | |
| | 4- El sistema actualiza el estado de la cuenta del empleado a "desactivada", revoca su acceso al sistema de forma inmediata (conservando el registro histórico de acciones) y muestra la lista de empleados actualizada con el nuevo estado. |

**Curso Alterno**

[A1] En el paso 2, si la distribuidora no tiene empleados registrados:
  1. El sistema muestra el mensaje "Aún no creaste accesos para empleados." y ofrece acceso directo a CU-44 para crear el primero.
  El caso de uso termina.

[A2] En el paso 3, si el administrador selecciona la acción de reactivar la cuenta de un empleado desactivado:
  1. El sistema actualiza el estado de la cuenta del empleado a "activa" y restaura su acceso con los permisos de su rol, sin necesidad de volver a configurarlos.
  2. El sistema muestra la lista de empleados actualizada con el nuevo estado del empleado.
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar la lista de empleados:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

[E2] En el paso 4, si ocurre un error al cambiar el estado de la cuenta:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-58 — Consultar detalle de pedido del comprador

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar detalle de pedido del comprador |
| **Requerimiento Funcional** | RF-056 |
| **Versión** | 1.0 |
| **Actor** | Comprador autenticado |
| **Descripción** | El comprador accede al detalle completo de un pedido específico desde su historial, incluyendo los productos, precios registrados y las acciones disponibles si hay propuestas de sustitución pendientes. |
| **Precondición** | El comprador tiene una sesión activa en modo comprador. Existe al menos un pedido en su historial. |
| **Post condición** | El comprador visualiza el detalle completo del pedido seleccionado. Si el pedido tiene una propuesta de sustitución pendiente de respuesta, las opciones Aceptar y Rechazar están disponibles (CU-30). |
| **Importancia** | Esencial |
| **Resumen** | Vista de detalle del pedido desde la perspectiva del comprador. Muestra número de pedido, nombre del distribuidor, estado actual, fecha de creación, dirección de entrega y lista de productos con cantidad en la unidad del producto y precio al momento de la confirmación. Si hay una sustitución pendiente, permite responderla. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El comprador selecciona un pedido desde su historial (CU-34) o desde el centro de notificaciones (CU-31). | |
| | 2- El sistema recupera el detalle completo del pedido y lo muestra: número de pedido, nombre del distribuidor, estado actual, fecha de creación, dirección de entrega registrada y lista de productos con cantidad y precio unitario al momento de la confirmación. |
| 3- El comprador revisa el detalle de su pedido. | |
| | 4- El sistema verifica si el pedido tiene propuestas de sustitución pendientes de respuesta y, de tenerlas, muestra las opciones Aceptar y Rechazar activas para el artículo afectado. |

**Curso Alterno**

[A1] En el paso 4, si el pedido no tiene propuestas de sustitución pendientes:
  1. El sistema muestra el detalle del pedido sin acciones adicionales.
  El caso de uso termina.

[E1] En el paso 2, si ocurre un error al recuperar el detalle del pedido:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

### CU-59 — Consultar detalle de pedido del distribuidor

| Campo | Valor |
|:---|:---|
| **Caso de Uso** | Consultar detalle de pedido del distribuidor |
| **Requerimiento Funcional** | RF-057 |
| **Versión** | 1.0 |
| **Actor** | Distribuidor |
| **Descripción** | El distribuidor accede al detalle completo de un pedido específico desde el panel de pedidos activos o desde el historial, incluyendo el stock disponible y reservado de cada producto y las acciones disponibles según el estado del pedido. |
| **Precondición** | El actor tiene una sesión activa en modo distribuidor. Existe al menos un pedido en el panel de pedidos activos o en el historial. |
| **Post condición** | El actor visualiza el detalle completo del pedido con todos sus datos y las acciones disponibles según el estado. |
| **Importancia** | Esencial |
| **Resumen** | Vista de detalle del pedido desde la perspectiva del distribuidor. Muestra todos los datos del pedido, stock disponible y reservado de cada producto al momento de la consulta, y las acciones habilitadas según el estado actual. |

**Curso Normal**

| ACTOR | SISTEMA |
|:---|:---|
| 1- El actor selecciona un pedido desde el panel de pedidos activos (CU-26) o desde el historial (CU-33). | |
| | 2- El sistema recupera el detalle completo del pedido y lo muestra: número de pedido, estado actual, nombre del comprador, número de teléfono del comprador, dirección de entrega, fecha de creación, lista de productos con cantidad y precio de venta al momento de la confirmación, stock disponible y reservado de cada producto al momento de la consulta, y las acciones disponibles según su estado actual (Pendiente: Aceptar / Rechazar / Proponer sustituto; Aceptado: Marcar como En camino; En camino: Marcar como Entregado). |
| 3- El actor revisa el detalle del pedido para tomar la acción correspondiente. | |

**Curso Alterno**

[E1] En el paso 2, si ocurre un error al recuperar el detalle del pedido:
  1. El sistema muestra el mensaje "No fue posible completar la operación. Intente nuevamente más tarde."
  El caso de uso termina.

---

*Especificación generada con base en: Cockburn, A. (2001) Writing Effective Use Cases · Larman, C. (2004) Applying UML and Patterns, cap. 6 · Jacobson, I. (1992) Object-Oriented Software Engineering · OMG UML 2.x · Requerimientos funcionales RF-001 a RF-060 (Sección 1.8, Proyecto Marketplace Mayorista, Universidad ORT Uruguay)*
