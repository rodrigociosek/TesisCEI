# Sección 1.8 — Lista de Requerimientos
## Marketplace Mayorista · Anteproyecto
### Reorganizado según ISO/IEC/IEEE 29148:2018 y Reglas AP-ATI (versión 2)
### Versión 8 — Corrección de contradicciones e inconsistencias de coherencia

---

> **Nota de versión:** Esta versión reemplaza la V4. Se elimina el concepto de
> "presentación" en su totalidad y se introduce el modelo de Precios por Volumen,
> consistente con la terminología del mercado mayorista. Se incorpora además la
> distinción entre productos Empaquetados y Fraccionables, con sus reglas de stock
> y visualización correspondientes.

---

## BLOQUE A — REQUERIMIENTOS FUNCIONALES (RF)

---

### Módulo 1: Marketplace

---

```
─────────────────────────────────────────────────
ID:      RF-001
Título:  Visualización del catálogo de productos
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar el catálogo completo de productos a cualquier
  usuario sin requerir autenticación previa.
  Para cada producto, el sistema debe mostrar:
    - Nombre
    - Imagen principal
    - Descripción
    - Categoría
    - Nombre del distribuidor que lo publica
    - Precio mínimo entre los precios por volumen disponibles del producto

Reglas de negocio
  - Solo se muestran productos cuyo estado sea "Publicado".
  - Un producto sin imagen se muestra con una imagen de reemplazo predeterminada.
  - La vista predeterminada del catálogo es la vista en grilla.

Resultado esperado
  - Si existen productos publicados: el sistema muestra el catálogo completo
    con todos los campos indicados.
  - Si no existen productos publicados: el sistema muestra el mensaje
    "No hay productos disponibles en este momento."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-002
Título:  Búsqueda de productos por nombre
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir a cualquier usuario buscar productos ingresando
  texto libre en el campo de búsqueda del catálogo. El sistema debe mostrar
  únicamente los productos cuyos nombres contengan el texto ingresado.

Reglas de negocio
  - La búsqueda opera únicamente sobre productos en estado "Publicado".
  - La búsqueda no distingue entre mayúsculas y minúsculas.

Resultado esperado
  - Si existen productos que coinciden con el texto ingresado: el sistema
    muestra el listado filtrado a esos productos.
  - Si ningún producto coincide: el sistema muestra el mensaje
    "No se encontraron productos con ese nombre."
  - Si el campo de búsqueda está vacío al ejecutar: el sistema muestra
    el catálogo completo sin filtrar.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-003
Título:  Filtrado del catálogo por criterios
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir a cualquier usuario filtrar el catálogo de
  productos por los siguientes criterios, de forma individual o combinada:
    - Categoría
    - Distribuidor
    - Precio mínimo
    - Precio máximo

Reglas de negocio
  - Los filtros operan únicamente sobre productos en estado "Publicado".
  - Un filtro vacío o sin selección no restringe el resultado por ese criterio.
  - Los filtros de esta ficha (RF-003) y la búsqueda por nombre (RF-002)
    pueden aplicarse simultáneamente.

Resultado esperado
  - Si existen productos que coinciden con los filtros aplicados: el sistema
    muestra únicamente esos productos.
  - Si ningún producto coincide con los filtros aplicados: el sistema muestra
    el mensaje "No se encontraron productos con los filtros aplicados."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-004
Título:  Vista del perfil del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar el perfil público de un distribuidor a cualquier
  usuario que lo consulte.
  El sistema debe mostrar:
    - Nombre del distribuidor
    - Descripción del distribuidor
    - Zona de entrega
    - Calificación promedio (valor numérico y representación visual)
    - Catálogo completo de productos publicados por ese distribuidor

Reglas de negocio
  - Solo se muestran en el catálogo del perfil los productos del distribuidor
    en estado "Publicado".
  - Si el distribuidor no tiene calificaciones registradas, el sistema muestra
    un indicador de ausencia de calificaciones en lugar del promedio.

Resultado esperado
  - Si el distribuidor tiene productos publicados: el sistema muestra el
    perfil completo con su catálogo.
  - Si el distribuidor no tiene productos publicados: el sistema muestra el
    perfil con su información y el catálogo vacío con el mensaje
    "Este distribuidor no tiene productos publicados actualmente."
  - Si el perfil del distribuidor no existe: el sistema muestra el mensaje
    "El perfil del distribuidor no está disponible."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-005
Título:  Detalle del producto con precios por volumen
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar la página de detalle de un producto a cualquier
  usuario que lo consulte.
  El sistema debe mostrar:
    - Nombre del producto
    - Imagen principal (o imagen de reemplazo si no tiene)
    - Descripción
    - Categoría
    - Nombre del distribuidor con enlace al perfil del distribuidor (RF-004)
    - Tipo de producto (Empaquetado / Fraccionable)
    - Unidad de venta del producto
    - Tabla de precios por volumen disponibles, con los siguientes datos
      por cada precio por volumen:
        · Cantidad mínima para aplicar ese precio
        · Precio de venta por unidad
    - Campo para que el usuario ingrese la cantidad que desea

Reglas de negocio
  - Solo se muestran productos en estado "Publicado".
  - Si el producto es Empaquetado, la cantidad ingresada debe ser un número
    entero mayor o igual a la cantidad mínima de compra definida por el
    distribuidor.
  - Si el producto es Fraccionable, la cantidad ingresada debe ser un
    múltiplo del incremento de venta definido por el distribuidor y no
    menor a la cantidad mínima de compra definida.
  - Para productos Fraccionables, la cantidad se ingresa y muestra en la
    unidad de visualización del producto (metros, litros o kilogramos).
    El sistema acepta decimales en la cantidad ingresada cuando la unidad
    de visualización es metros, litros o kilogramos.
  - El sistema aplica automáticamente el precio por volumen cuya cantidad
    mínima de aplicación sea la más alta sin superar la cantidad pedida.
  - Un producto con stock disponible igual a cero se muestra con el
    indicador "Sin stock disponible" pero no se oculta.

Resultado esperado
  - Si el producto existe y tiene al menos un precio por volumen definido:
    el sistema muestra el detalle completo con todos los campos indicados.
  - Si el usuario ingresa una cantidad válida: el sistema muestra el precio
    por volumen aplicable y el total calculado.
  - Si el usuario ingresa una cantidad que no es múltiplo del incremento
    de venta (productos Fraccionables): el sistema muestra el mensaje
    "La cantidad debe ser múltiplo de [incremento] [unidad]." y no agrega
    el producto al carrito.
  - Si el usuario ingresa una cantidad inferior a la mínima de compra:
    el sistema muestra el mensaje "La cantidad mínima de compra es
    [cantidad mínima] [unidad]." y no agrega el producto al carrito.
  - Si el producto no existe o fue eliminado: el sistema muestra el mensaje
    "Este producto no está disponible."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-006
Título:  Alternancia de vista del catálogo
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir a cualquier usuario alternar la visualización del
  catálogo entre vista en grilla y vista en lista, mediante un control visible
  en la pantalla del catálogo.

Resultado esperado
  - Si el usuario selecciona vista en grilla: el sistema organiza los productos
    en columnas múltiples.
  - Si el usuario selecciona vista en lista: el sistema organiza los productos
    en filas con mayor detalle horizontal.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-007
Título:  Gestión del carrito multiproveedor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador autenticado agregar productos al
  carrito, modificar la cantidad de cada producto dentro del carrito, y
  eliminar productos del carrito. El sistema debe organizar los ítems del
  carrito agrupados por distribuidor y mostrar el subtotal por distribuidor.

Reglas de negocio
  - El comprador puede agregar productos de distintos distribuidores en
    una misma sesión de carrito.
  - La cantidad mínima por producto es la cantidad mínima de compra
    definida por el distribuidor para ese producto.
  - Para productos Fraccionables, la cantidad debe ser un múltiplo del
    incremento de venta definido por el distribuidor.
  - Un producto sin stock disponible no puede agregarse al carrito.
  - El precio por volumen mostrado en el carrito es estimado y se calcula
    según la cantidad ingresada. El precio definitivo se fija al confirmar
    el pedido (RF-008).

Resultado esperado
  - Si el comprador agrega un producto con stock disponible y cantidad
    válida: el sistema añade el producto al carrito con el precio por
    volumen estimado correspondiente a la cantidad ingresada y actualiza
    el resumen por distribuidor.
  - Si el comprador agrega un producto sin stock disponible: el sistema
    muestra el mensaje "Este producto no tiene stock disponible." y no
    agrega el producto.
  - Si el comprador ingresa una cantidad inferior a la mínima de compra:
    el sistema muestra el mensaje "La cantidad mínima de compra es
    [cantidad mínima] [unidad]." y no agrega el producto.
  - Si el comprador ingresa una cantidad que no es múltiplo del incremento
    de venta (productos Fraccionables): el sistema muestra el mensaje
    "La cantidad debe ser múltiplo de [incremento] [unidad]." y no agrega
    el producto.
  - Si el comprador modifica la cantidad de un producto: el sistema
    actualiza la cantidad, recalcula el precio por volumen aplicable y
    actualiza el subtotal del distribuidor correspondiente.
  - Si el comprador elimina un producto: el sistema lo retira del carrito
    y actualiza el resumen.
  - Si el carrito queda vacío tras eliminar un producto: el sistema muestra
    el mensaje "Tu carrito está vacío."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-008
Título:  Confirmación del pedido desde el carrito
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador autenticado confirmar el pedido desde
  el carrito. Al confirmar, el sistema debe:
    - Solicitar al comprador el ingreso de una dirección de entrega
    - Generar un sub-pedido separado por cada distribuidor presente en
      el carrito
    - Vaciar el carrito

Reglas de negocio
  - El carrito debe contener al menos un producto para habilitar la
    confirmación.
  - La dirección de entrega es obligatoria antes de confirmar.
  - Cada sub-pedido generado queda en estado "Pendiente".
  - El precio registrado en cada sub-pedido corresponde al precio por
    volumen vigente en el momento de la confirmación y no varía si el
    distribuidor lo modifica posteriormente.

Resultado esperado
  - Si la dirección de entrega fue ingresada y el carrito tiene al menos
    un producto: el sistema genera los sub-pedidos por distribuidor, vacía
    el carrito y muestra al comprador el número de pedido de cada sub-pedido.
  - Si el campo de dirección de entrega está vacío: el sistema muestra el
    mensaje "Debés ingresar una dirección de entrega para continuar." y no
    confirma el pedido.
  - Si el carrito está vacío: el sistema no habilita el control de
    confirmación.
─────────────────────────────────────────────────
```

---

### Módulo 2: Cuenta y Acceso

---

```
─────────────────────────────────────────────────
ID:      RF-009
Título:  Registro de cuenta con verificación SMS
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir a cualquier usuario crear una cuenta nueva
  ingresando los siguientes datos:
    - Nombre completo
    - Número de teléfono
    - Contraseña

  Al enviar el formulario, el sistema debe enviar un código de verificación
  por SMS al número ingresado. El usuario debe ingresar ese código para
  activar la cuenta.

Reglas de negocio
  - El número de teléfono debe ser único en el sistema.
  - La cuenta permanece inactiva hasta que el usuario ingrese el código SMS
    correcto.
  - El código de verificación tiene validez de 10 minutos.

Resultado esperado
  - Si el número de teléfono no está registrado y el usuario envía el
    formulario correctamente: el sistema envía el código SMS y muestra
    el campo para ingresarlo.
  - Si el código SMS ingresado es correcto: el sistema activa la cuenta
    e inicia la sesión del usuario en modo comprador.
  - Si el número de teléfono ya está registrado en el sistema: el sistema
    muestra el mensaje "El número de teléfono ya está registrado. Iniciá
    sesión o recuperá tu contraseña." y no envía el SMS.
  - Si el código SMS ingresado no coincide: el sistema muestra el mensaje
    "El código ingresado no es válido. Intentá de nuevo."
  - Si el código SMS vence antes de ser ingresado: el sistema muestra
    el mensaje "El código expiró. Solicitá uno nuevo." y habilita el reenvío
    de un nuevo código.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-010
Título:  Inicio de sesión del comprador
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador con cuenta activa iniciar sesión
  ingresando:
    - Número de teléfono registrado
    - Contraseña

Resultado esperado
  - Si las credenciales son correctas: el sistema inicia la sesión y muestra
    la pantalla principal en modo comprador.
  - Si las credenciales son incorrectas: el sistema muestra el mensaje
    "El teléfono o la contraseña son incorrectos."
  - Si el número de teléfono no está registrado: el sistema muestra el
    mensaje "No encontramos una cuenta con ese número de teléfono."
  - Si la cuenta existe pero no está verificada por SMS: el sistema muestra
    el mensaje "Tu cuenta aún no fue verificada. Revisá el SMS que te
    enviamos." y ofrece la opción de reenviar el código de verificación.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-011
Título:  Recuperación de contraseña del comprador
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador con cuenta activa recuperar su
  contraseña. El sistema debe:
    - Solicitar el número de teléfono registrado
    - Enviar un código de verificación por SMS a ese número
    - Permitir al usuario establecer una nueva contraseña tras ingresar
      el código correcto

Reglas de negocio
  - El código SMS de recuperación tiene validez de 10 minutos.
  - Una vez establecida la nueva contraseña, el código de recuperación
    queda inválido.

Resultado esperado
  - Si el número de teléfono está registrado: el sistema envía el código
    SMS y muestra el campo para ingresarlo.
  - Si el código SMS es correcto: el sistema habilita el campo para ingresar
    la nueva contraseña.
  - Si la nueva contraseña es confirmada correctamente: el sistema actualiza
    la contraseña y redirige al inicio de sesión con el mensaje
    "Tu contraseña fue actualizada correctamente."
  - Si el número de teléfono no está registrado: el sistema muestra el
    mensaje "No encontramos una cuenta con ese número de teléfono."
  - Si el código SMS es incorrecto: el sistema muestra el mensaje
    "El código ingresado no es válido. Intentá de nuevo."
  - Si el código SMS vence: el sistema muestra el mensaje
    "El código expiró. Solicitá uno nuevo." y habilita el reenvío.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-012
Título:  Activación del modo distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador autenticado activar el modo
  distribuidor en su cuenta, habilitando el acceso al panel de gestión
  del distribuidor. La activación requiere confirmación explícita del
  usuario. Solo puede existir un modo distribuidor activo simultáneamente.

Resultado esperado
  - Si el comprador confirma la activación: el sistema habilita el modo
    distribuidor en la cuenta y redirige al flujo de configuración inicial
    del perfil del distribuidor (RF-052) antes de dar acceso al panel.
  - Si el comprador cancela: el sistema no realiza cambios en la cuenta.
  - Si el modo distribuidor ya está activo en la cuenta: el sistema no
    muestra la opción de activación.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-013
Título:  Cambio entre modos de usuario
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al usuario que tiene ambos modos activos
  (comprador y distribuidor) cambiar entre ellos sin cerrar sesión ni
  cambiar de cuenta, mediante un control visible en la interfaz.

Resultado esperado
  - Si el usuario cambia al modo distribuidor: el sistema muestra el panel
    del distribuidor con sus funciones específicas.
  - Si el usuario cambia al modo comprador: el sistema muestra la vista del
    comprador con su historial y carrito.
─────────────────────────────────────────────────
```

---

### Módulo 3: Gestión de Productos

---

```
─────────────────────────────────────────────────
ID:      RF-014
Título:  Carga de producto nuevo
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor crear un nuevo producto ingresando:
    - Foto del producto
    - Nombre
    - Descripción
    - Categoría
    - Tipo de producto: Empaquetado o Fraccionable
    - Stock inicial

  Si el tipo de producto es Empaquetado, el sistema debe registrar además:
    - Descripción de la unidad de venta (texto libre que describe qué
      constituye una unidad, por ejemplo "caja de 12 latas")
    - Cantidad mínima de compra (en unidades enteras)

  Si el tipo de producto es Fraccionable, el sistema debe registrar además:
    - Unidad base interna: Gramo, Mililitro o Centímetro
    - Incremento de venta: múltiplo mínimo aceptado por el sistema al
      recibir una cantidad (expresado en la unidad de visualización)
    - Cantidad mínima de compra (expresada en la unidad de visualización)
    - Métrica de visualización de stock: Kilogramos, Litros o Metros,
      según corresponda a la unidad base interna seleccionada

  El stock inicial para productos Empaquetados se ingresa en unidades
  enteras. El stock inicial para productos Fraccionables se ingresa en
  la unidad base interna y el sistema lo almacena como número entero
  sin decimales.

Reglas de negocio
  - El nombre del producto no puede estar vacío.
  - La categoría debe seleccionarse de una lista predefinida por el sistema.
  - El tipo de producto es obligatorio.
  - El stock inicial no puede ser negativo.
  - La cantidad mínima de compra no puede ser cero ni negativa.
  - El incremento de venta no puede ser cero ni negativo (solo Fraccionables).
  - Para productos Fraccionables, la métrica de visualización disponible
    según la unidad base interna es:
      · Gramo → Kilogramos
      · Mililitro → Litros
      · Centímetro → Metros
  - Un producto recién creado queda en estado "Pausado" por defecto.

Resultado esperado
  - Si todos los campos obligatorios son completados correctamente: el sistema
    crea el producto y lo muestra en el panel de productos del distribuidor
    en estado "Pausado".
  - Si el nombre del producto está vacío: el sistema muestra el mensaje
    "El nombre del producto es obligatorio." y no crea el producto.
  - Si el tipo de producto no fue seleccionado: el sistema muestra el mensaje
    "Debés seleccionar el tipo de producto." y no crea el producto.
  - Si el stock inicial es negativo: el sistema muestra el mensaje
    "El stock inicial no puede ser negativo." y no crea el producto.
  - Si la cantidad mínima de compra es cero o negativa: el sistema muestra
    el mensaje "La cantidad mínima de compra debe ser mayor a cero." y no
    crea el producto.
  - Si el incremento de venta es cero o negativo (solo productos
    Fraccionables): el sistema muestra el mensaje "El incremento de venta
    debe ser mayor a cero." y no crea el producto.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-015
Título:  Registro de precio por volumen
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor registrar un nuevo precio por
  volumen para cualquiera de sus productos. El registro puede realizarse
  durante la creación del producto o posteriormente desde el panel de
  gestión del producto. Cada precio por volumen representa el precio
  unitario aplicable a partir de una cantidad mínima de compra. El sistema
  debe registrar para cada precio por volumen:
    - Cantidad mínima de aplicación (a partir de cuántas unidades rige
      este precio)
    - Precio de venta por unidad
    - Precio de costo por unidad

  La cantidad mínima de aplicación se expresa en unidades para productos
  Empaquetados, y en la unidad de visualización para productos Fraccionables.

Reglas de negocio
  - El precio de venta por unidad no puede ser cero ni negativo.
  - El precio de costo por unidad no puede ser negativo.
  - La cantidad mínima de aplicación no puede ser cero ni negativa.
  - El sistema aplica automáticamente el precio por volumen cuya cantidad
    mínima de aplicación sea la más alta sin superar la cantidad pedida.
    Si la cantidad pedida es inferior a la cantidad mínima del precio por
    volumen más bajo, no puede completarse el pedido.
  - Para poder publicar un producto, debe tener al menos un precio por
    volumen registrado.

Resultado esperado
  - Si todos los campos cumplen las reglas de negocio: el sistema registra
    el precio por volumen y lo muestra en el listado de precios del producto.
  - Si el precio de venta es cero o negativo: el sistema muestra el mensaje
    "El precio de venta debe ser mayor a cero." y no registra el precio
    por volumen.
  - Si el precio de costo es negativo: el sistema muestra el mensaje
    "El precio de costo no puede ser negativo." y no registra el precio
    por volumen.
  - Si la cantidad mínima de aplicación es cero o negativa: el sistema
    muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no
    registra el precio por volumen.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-016
Título:  Edición de precio por volumen
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor editar los datos de un precio
  por volumen ya registrado en cualquiera de sus productos. Los datos
  editables son:
    - Cantidad mínima de aplicación
    - Precio de venta por unidad
    - Precio de costo por unidad

Reglas de negocio
  - El precio de venta por unidad no puede ser cero ni negativo.
  - El precio de costo por unidad no puede ser negativo.
  - La cantidad mínima de aplicación no puede ser cero ni negativa.
  - Los pedidos en estado "Pendiente" o "Aceptado" que referencian este
    precio conservan el precio de venta registrado al momento de su
    confirmación, sin importar los cambios posteriores.

Resultado esperado
  - Si los nuevos datos cumplen las reglas de negocio: el sistema actualiza
    el precio por volumen y muestra los datos actualizados en el listado
    de precios del producto.
  - Si el precio de venta queda cero o negativo: el sistema muestra el
    mensaje "El precio de venta debe ser mayor a cero." y no aplica los
    cambios.
  - Si el precio de costo queda negativo: el sistema muestra el mensaje
    "El precio de costo no puede ser negativo." y no aplica los cambios.
  - Si la cantidad mínima de aplicación queda cero o negativa: el sistema
    muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no
    aplica los cambios.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-017
Título:  Eliminación de precio por volumen
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor eliminar un precio por volumen
  registrado en cualquiera de sus productos.

Reglas de negocio
  - No puede eliminarse un precio por volumen si es el único registrado
    para un producto en estado "Publicado".
  - No puede eliminarse un precio por volumen si tiene pedidos en estado
    "Pendiente" o "Aceptado" que lo referencian.

Resultado esperado
  - Si el precio por volumen puede eliminarse: el sistema lo elimina y
    actualiza el listado de precios del producto con el mensaje
    "El precio por volumen fue eliminado correctamente."
  - Si el distribuidor intenta eliminar el único precio por volumen de un
    producto publicado: el sistema muestra el mensaje "No es posible
    eliminar el único precio por volumen de un producto publicado." y no
    lo elimina.
  - Si el distribuidor intenta eliminar un precio por volumen con pedidos
    activos que lo referencian: el sistema muestra el mensaje "No es posible
    eliminar este precio porque tiene pedidos pendientes o aceptados." y no
    lo elimina.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-018
Título:  Publicación y pausa de producto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor cambiar el estado de visibilidad
  de cualquiera de sus productos entre "Publicado" y "Pausado", mediante
  una acción directa desde el panel de productos.

Reglas de negocio
  - Un producto solo puede publicarse si tiene al menos un precio por
    volumen definido.
  - Pausar un producto no elimina sus precios por volumen ni afecta los
    pedidos activos que lo incluyen.

Resultado esperado
  - Si el distribuidor publica un producto con precios por volumen definidos:
    el sistema cambia el estado a "Publicado" y el producto queda visible
    en el catálogo.
  - Si el distribuidor pausa un producto: el sistema cambia el estado a
    "Pausado" y el producto deja de ser visible en el catálogo.
  - Si el distribuidor intenta publicar un producto sin precios por volumen:
    el sistema muestra el mensaje "El producto necesita al menos un precio
    por volumen para poder ser publicado." y no cambia el estado.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-019
Título:  Edición de producto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor editar los datos de cualquiera
  de sus productos. Los datos editables incluyen:
    - Nombre
    - Descripción
    - Categoría
    - Foto
    - Descripción de la unidad de venta (solo Empaquetados)
    - Cantidad mínima de compra
    - Incremento de venta (solo Fraccionables)
    - Métrica de visualización de stock (solo Fraccionables)
    - Stock actual

Reglas de negocio
  - Los pedidos en estado "Pendiente" o "Aceptado" que incluyen el producto
    conservan el precio de venta registrado al momento de la confirmación,
    sin importar los cambios posteriores al precio.
  - El stock del producto no puede reducirse por debajo del stock reservado
    en pedidos activos.
  - El stock del producto puede incrementarse en cualquier momento sin
    restricciones.
  - El tipo de producto no puede modificarse si el producto tiene al menos
    un pedido registrado en cualquier estado.
  - La métrica de visualización de stock puede modificarse en cualquier
    momento sin restricciones.
  - El nombre del producto no puede quedar vacío.

Resultado esperado
  - Si los nuevos datos son válidos: el sistema actualiza el producto con
    los datos ingresados.
  - Si el distribuidor intenta reducir el stock por debajo del stock
    reservado: el sistema muestra el mensaje "No es posible reducir el stock
    por debajo de las unidades reservadas en pedidos activos." y no aplica
    el cambio de stock.
  - Si el distribuidor intenta modificar el tipo de producto con pedidos
    registrados: el sistema muestra el mensaje "El tipo de producto no puede
    modificarse cuando el producto tiene pedidos registrados." y no aplica
    el cambio.
  - Si el nombre del producto queda vacío: el sistema muestra el mensaje
    "El nombre del producto es obligatorio." y no aplica los cambios.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-020
Título:  Eliminación de producto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor eliminar un producto de la base
  de datos del sistema.

Reglas de negocio
  - Un producto no puede eliminarse si tiene pedidos en estado "Pendiente"
    o "Aceptado".
  - Toda referencia existente al producto eliminado (historial de pedidos,
    páginas de detalle) debe mostrar el nombre del producto con un indicador
    visual de "No disponible".

Resultado esperado
  - Si el producto no tiene pedidos en estado "Pendiente" ni "Aceptado":
    el sistema elimina el producto y muestra el mensaje
    "El producto fue eliminado correctamente."
  - Si el producto tiene pedidos en estado "Pendiente" o "Aceptado": el
    sistema muestra el mensaje "No es posible eliminar este producto porque
    tiene pedidos pendientes o aceptados." y no elimina el producto.
  - En cualquier referencia existente al producto eliminado: el sistema
    muestra el nombre del producto con una etiqueta gris con el texto
    "No disponible" junto al nombre del producto.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-021
Título:  Visualización de stock del producto
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor, en el panel de gestión de
  productos, los valores de stock para cada producto, expresados en la
  unidad correspondiente al tipo de producto:
    - Para productos Empaquetados: stock disponible y stock reservado
      expresados en unidades enteras.
    - Para productos Fraccionables: stock disponible y stock reservado
      expresados en la métrica de visualización elegida por el distribuidor
      (Kilogramos, Litros o Metros). El sistema convierte automáticamente
      desde la unidad base interna.

Reglas de negocio
  - El stock reservado corresponde a las unidades comprometidas en pedidos
    en estado "Aceptado" pendientes de entrega.
  - El stock disponible es el stock total menos el stock reservado.
  - Para productos Fraccionables, la conversión entre la unidad base interna
    y la métrica de visualización es:
      · Gramo → Kilogramos: dividir por 1000
      · Mililitro → Litros: dividir por 1000
      · Centímetro → Metros: dividir por 100
  - Para productos Fraccionables, el sistema acepta y muestra decimales
    en la métrica de visualización.

Resultado esperado
  - Si el producto tiene stock: el sistema muestra el stock disponible y
    el stock reservado de forma visualmente diferenciada, en la unidad
    correspondiente al tipo de producto.
  - Si el stock disponible es cero: el sistema lo indica visualmente como
    "Sin stock disponible."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-022
Título:  Configuración de umbral mínimo de stock
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor definir un umbral mínimo de
  stock para cada producto. Cuando el stock disponible descienda por debajo
  de ese umbral, el sistema debe enviar una notificación al distribuidor
  indicando el producto afectado.

  El umbral se expresa en unidades para productos Empaquetados, y en la
  métrica de visualización para productos Fraccionables.

Reglas de negocio
  - El umbral mínimo no puede ser negativo.
  - La notificación se envía únicamente cuando el stock disponible cruza
    el umbral hacia abajo, no en cada consulta mientras permanezca por
    debajo del umbral.

Resultado esperado
  - Si el distribuidor configura el umbral con un valor válido: el sistema
    registra el valor. El umbral configurado queda visible en el panel del
    producto junto con los valores de stock (RF-021).
  - Si el stock disponible desciende por debajo del umbral configurado:
    el sistema muestra una notificación al distribuidor con el nombre del
    producto afectado.
  - Si el umbral ingresado es negativo: el sistema muestra el mensaje
    "El umbral mínimo no puede ser negativo." y no registra el valor.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-023
Título:  Filtrado de productos del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor filtrar el listado de sus
  productos por los siguientes criterios, de forma individual o combinada:
    - Categoría
    - Estado de visibilidad ("Publicado" / "Pausado")
    - Estado de stock ("Con stock" / "Sin stock")

Resultado esperado
  - Si existen productos que coinciden con los filtros aplicados: el sistema
    muestra únicamente esos productos.
  - Si ningún producto coincide con los filtros aplicados: el sistema muestra
    el mensaje "No hay productos que coincidan con los filtros aplicados."
─────────────────────────────────────────────────
```

---

### Módulo 4: Gestión de Pedidos

---

```
─────────────────────────────────────────────────
ID:      RF-024
Título:  Notificación de pedido entrante al distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe notificar al distribuidor cuando un comprador confirme un
  sub-pedido dirigido a ese distribuidor, indicando que hay un nuevo pedido
  pendiente de revisión en el panel de pedidos activos (RF-055).
  La notificación debe incluir:
    - Número del pedido
    - Nombre del comprador

Resultado esperado
  - Si el comprador confirma un pedido: el sistema envía la notificación
    al distribuidor con el número del pedido y el nombre del comprador,
    y actualiza el panel de pedidos activos (RF-055) con el nuevo pedido.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-025
Título:  Aceptación de pedido con mensaje WhatsApp
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor aceptar un pedido en estado
  "Pendiente". Al aceptar, el sistema debe:
    - Cambiar el estado del pedido a "Aceptado"
    - Reservar el stock de todos los productos incluidos en el pedido
    - Abrir WhatsApp en el dispositivo del distribuidor con un mensaje
      pre-redactado dirigido al comprador, incluyendo el número del pedido,
      la confirmación de aceptación y el detalle de los productos con sus
      cantidades en la unidad del producto

Reglas de negocio
  - Solo se pueden aceptar pedidos en estado "Pendiente".
  - El stock reservado queda indisponible para nuevos pedidos desde el
    momento de la aceptación.
  - El número de teléfono destino del mensaje de WhatsApp es el del
    comprador registrado en el sistema.

Resultado esperado
  - Si el distribuidor acepta el pedido y hay stock suficiente: el sistema
    cambia el estado a "Aceptado", reserva el stock correspondiente y abre
    WhatsApp con el mensaje pre-redactado listo para enviar.
  - Si el stock disponible es insuficiente para cubrir algún producto del
    pedido: el sistema muestra el mensaje "No hay stock suficiente para
    aceptar este pedido. Revisá el inventario antes de continuar." y no
    cambia el estado del pedido.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-026
Título:  Rechazo de pedido con motivo
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor rechazar un pedido en estado
  "Pendiente" o "En camino". Al rechazar, el sistema debe:
    - Solicitar al distribuidor el ingreso de un motivo de rechazo
    - Cambiar el estado del pedido a "Rechazado"
    - Liberar el stock reservado asociado al pedido
    - Notificar al comprador indicando el motivo de rechazo

Reglas de negocio
  - Solo se pueden rechazar pedidos en estado "Pendiente" o "En camino".
  - El ingreso del motivo de rechazo es obligatorio.
  - Para pedidos en estado "Pendiente", el motivo debe seleccionarse de
    la lista predefinida: Sin stock del producto solicitado, Producto
    discontinuado, Pedido fuera de la zona de entrega, Error en los datos
    del pedido, Distribuidora no disponible en la fecha solicitada.
  - Para pedidos en estado "En camino", el motivo es texto libre obligatorio
    que describe la situación ocurrida durante la entrega.
  - El stock reservado queda liberado inmediatamente al rechazar el pedido.

Resultado esperado
  - Si el distribuidor ingresa un motivo y confirma el rechazo: el sistema
    cambia el estado a "Rechazado", libera el stock reservado y notifica
    al comprador con el motivo indicado.
  - Si el distribuidor intenta confirmar el rechazo sin ingresar motivo:
    el sistema muestra el mensaje "Ingresá un motivo de rechazo antes de
    confirmar." y no procesa el rechazo.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-027
Título:  Propuesta de sustitución de producto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor proponer un producto sustituto
  para un artículo de un pedido en estado "Pendiente". El distribuidor debe
  seleccionar el producto sustituto de su propio catálogo. Al confirmar, el
  sistema debe notificar al comprador mostrando el producto original y el
  sustituto propuesto.

Reglas de negocio
  - Solo se puede proponer sustitución en pedidos en estado "Pendiente".
  - El producto sustituto propuesto debe pertenecer al catálogo del mismo
    distribuidor.
  - El pedido permanece en estado "Pendiente" mientras el comprador no
    responda la propuesta.

Resultado esperado
  - Si el distribuidor selecciona un sustituto válido y confirma: el sistema
    registra la propuesta y notifica al comprador mostrando el producto
    original y el sustituto propuesto.
  - Si el distribuidor no selecciona un sustituto: el sistema muestra el
    mensaje "Seleccioná un producto sustituto antes de enviar la propuesta."
    y no envía la propuesta.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-028
Título:  Respuesta del comprador a propuesta de sustitución
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al comprador autenticado aceptar o rechazar una
  propuesta de sustitución realizada por el distribuidor, sin salir del
  sistema. Al responder, el sistema debe:
    - Si el comprador acepta: actualizar el pedido reemplazando el producto
      original por el sustituto, y notificar al distribuidor que el cambio
      fue aceptado
    - Si el comprador rechaza: mantener el producto original en el pedido
      y notificar al distribuidor que el cambio fue rechazado

Reglas de negocio
  - El comprador solo puede responder mientras el pedido esté en estado
    "Pendiente".
  - Una propuesta ya respondida no puede modificarse.

Resultado esperado
  - Si el comprador acepta la propuesta: el sistema actualiza el pedido con
    el producto sustituto y notifica al distribuidor.
  - Si el comprador rechaza la propuesta: el sistema mantiene el producto
    original y notifica al distribuidor.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-029
Título:  Notificación al comprador por cambio de estado
─────────────────────────────────────────────────
Descripción
  El sistema debe enviar una notificación al comprador cada vez que el
  estado de alguno de sus pedidos cambie. La notificación debe incluir:
    - Número del pedido
    - Nuevo estado del pedido
    - Motivo de rechazo (únicamente cuando el nuevo estado sea "Rechazado")

Reglas de negocio
  - La notificación se envía en cada una de las siguientes transiciones:
    Pendiente → Aceptado, Pendiente → Rechazado, Aceptado → En camino,
    En camino → Entregado, En camino → Rechazado.
  - El mecanismo de envío de la notificación es notificaciones internas
    del sistema, accesibles desde el centro de notificaciones del comprador
    (RF-059).

Resultado esperado
  - Si el estado del pedido cambia a "Aceptado": el sistema envía al
    comprador una notificación con el número de pedido y el nuevo estado.
  - Si el estado cambia a "Rechazado" desde "Pendiente": el sistema envía
    al comprador una notificación con el número de pedido, el nuevo estado
    y el motivo de rechazo seleccionado.
  - Si el estado cambia a "Rechazado" desde "En camino": el sistema envía
    al comprador una notificación con el número de pedido, el nuevo estado
    y el motivo de rechazo ingresado por el distribuidor.
  - Si el estado cambia a "En camino": el sistema envía al comprador una
    notificación con el número de pedido y el nuevo estado.
  - Si el estado cambia a "Entregado": el sistema envía al comprador una
    notificación con el número de pedido y el nuevo estado, y habilita la
    opción de calificar al distribuidor (RF-033).
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-030
Título:  Avance del estado del pedido
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor avanzar el estado de un pedido
  aceptado a través de la siguiente secuencia:
    - De "Aceptado" a "En camino"
    - De "En camino" a "Entregado"

  Al marcar el pedido como "Entregado", el sistema debe descontar del
  inventario las unidades reservadas para ese pedido.

Reglas de negocio
  - El pedido solo puede avanzar al siguiente estado en la secuencia;
    no puede retroceder.
  - El descuento definitivo del stock ocurre únicamente al transitar al
    estado "Entregado".
  - Un pedido en estado "En camino" puede rechazarse mediante RF-026
    con motivo obligatorio, o marcarse como entregado o rechazado desde
    el plan de reparto (RF-050).

Resultado esperado
  - Si el distribuidor marca el pedido como "En camino": el sistema cambia
    el estado a "En camino" y envía la notificación al comprador (RF-029).
  - Si el distribuidor marca el pedido como "Entregado": el sistema cambia
    el estado a "Entregado", descuenta el stock reservado del inventario
    y envía la notificación al comprador (RF-029).
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-031
Título:  Historial de pedidos del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor el historial completo de los
  pedidos recibidos. Para cada pedido, el sistema debe mostrar:
    - Número del pedido
    - Fecha de creación
    - Estado actual
    - Nombre del comprador
    - Número de teléfono del comprador
    - Lista de productos solicitados con cantidad en la unidad del producto

Resultado esperado
  - Si el distribuidor tiene pedidos registrados: el sistema muestra el
    historial completo con todos los datos indicados.
  - Si el distribuidor no tiene pedidos registrados: el sistema muestra
    el mensaje "Aún no recibiste pedidos."
─────────────────────────────────────────────────
```

---

### Módulo 5: Para el Comprador

---

```
─────────────────────────────────────────────────
ID:      RF-032
Título:  Historial de pedidos del comprador
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al comprador autenticado el historial completo
  de sus pedidos. Para cada pedido, el sistema debe mostrar:
    - Número del pedido
    - Nombre del distribuidor
    - Fecha de creación
    - Estado actual
    - Lista de productos con cantidad en la unidad del producto

Resultado esperado
  - Si el comprador tiene pedidos registrados: el sistema muestra el
    historial completo con todos los datos indicados.
  - Si el comprador no tiene pedidos registrados: el sistema muestra el
    mensaje "Aún no realizaste pedidos."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-033
Título:  Calificación del distribuidor tras entrega
─────────────────────────────────────────────────
Descripción
  El sistema debe habilitar al comprador para calificar al distribuidor
  únicamente después de que un pedido de ese distribuidor sea marcado como
  "Entregado". La calificación registrada debe quedar visible en el perfil
  público del distribuidor.

Reglas de negocio
  - La opción de calificar se habilita exclusivamente tras la transición
    al estado "Entregado".
  - Cada pedido entregado habilita una sola calificación por parte del
    comprador.
  - Una calificación enviada no puede modificarse.
  - La calificación promedio visible en el perfil del distribuidor se
    recalcula al registrar una nueva calificación.

Resultado esperado
  - Si el pedido está en estado "Entregado" y el comprador no ha calificado
    aún: el sistema muestra el módulo de calificación habilitado.
  - Si el comprador envía su calificación: el sistema la registra y actualiza
    el promedio visible en el perfil del distribuidor (RF-004).
  - Si el comprador ya calificó ese pedido: el sistema muestra la
    calificación previamente enviada sin habilitar el módulo de calificación.
  - Si el pedido no está en estado "Entregado": el sistema no muestra el
    módulo de calificación.
─────────────────────────────────────────────────
```

---

### Módulo 6: Gestión de Proveedores

---

```
─────────────────────────────────────────────────
ID:      RF-034
Título:  Registro de proveedor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor registrar un proveedor ingresando:
    - Nombre del proveedor
    - Número de teléfono de WhatsApp del proveedor

Reglas de negocio
  - El nombre del proveedor no puede estar vacío.
  - El número de teléfono del proveedor no puede estar vacío.

Resultado esperado
  - Si los datos son válidos: el sistema registra el proveedor y lo muestra
    en el listado de proveedores del distribuidor.
  - Si algún campo obligatorio está vacío: el sistema muestra el mensaje
    "El nombre y el teléfono del proveedor son obligatorios." y no registra
    el proveedor.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-035
Título:  Edición de proveedor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor editar los datos de un proveedor
  ya registrado. Los datos editables son:
    - Nombre del proveedor
    - Número de teléfono de WhatsApp del proveedor

Reglas de negocio
  - El nombre del proveedor no puede quedar vacío.
  - El número de teléfono del proveedor no puede quedar vacío.

Resultado esperado
  - Si los nuevos datos son válidos: el sistema actualiza el proveedor y
    muestra la confirmación al distribuidor.
  - Si el nombre queda vacío: el sistema muestra el mensaje "El nombre del
    proveedor no puede quedar vacío." y no aplica los cambios.
  - Si el teléfono queda vacío: el sistema muestra el mensaje "El teléfono
    del proveedor no puede quedar vacío." y no aplica los cambios.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-036
Título:  Armado de pedido de reposición
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor armar un pedido de reposición
  para un proveedor registrado, seleccionando productos de su propio
  catálogo y especificando la cantidad requerida de cada uno en la unidad
  del producto.

Reglas de negocio
  - El proveedor destinatario del pedido debe estar registrado en el sistema.
  - La cantidad por producto no puede ser cero ni negativa.

Resultado esperado
  - Si el distribuidor selecciona al menos un producto con cantidad válida:
    el sistema registra el pedido de reposición como borrador listo para
    confirmar.
  - Si ningún producto fue agregado al pedido: el sistema muestra el mensaje
    "Agregá al menos un producto antes de continuar." y no crea el pedido.
  - Si alguna cantidad ingresada es inválida: el sistema muestra el mensaje
    "La cantidad debe ser mayor a cero." en el campo correspondiente.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-037
Título:  Confirmación de pedido de reposición por WhatsApp
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor confirmar un pedido de reposición.
  Al confirmar, el sistema debe abrir WhatsApp en el dispositivo del
  distribuidor con un mensaje pre-redactado dirigido al número de teléfono
  del proveedor, incluyendo la lista de productos y las cantidades
  solicitadas expresadas en la unidad del producto.

Reglas de negocio
  - El mensaje se genera automáticamente a partir de los productos y
    cantidades del pedido de reposición.
  - El número de teléfono destino del mensaje es el del proveedor registrado
    en el sistema.

Resultado esperado
  - Si el distribuidor confirma el pedido de reposición: el sistema abre
    WhatsApp con el mensaje pre-redactado listo para enviar al proveedor.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-038
Título:  Registro de precios por volumen del proveedor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor registrar los precios por volumen
  que un proveedor aplica para cada producto. Cada precio por volumen del
  proveedor representa el precio de costo unitario a partir de una cantidad
  mínima de compra. Para cada precio por volumen del proveedor, el sistema
  debe registrar:
    - Proveedor al que corresponde
    - Producto al que aplica
    - Cantidad mínima de aplicación
    - Precio de costo por unidad

  Esta información se utiliza como referencia para el análisis de rentabilidad
  y como base para futuras recomendaciones de compra según demanda del producto.

Reglas de negocio
  - El proveedor debe estar registrado en el sistema (RF-034).
  - El producto debe pertenecer al catálogo del distribuidor.
  - El precio de costo por unidad no puede ser negativo.
  - La cantidad mínima de aplicación no puede ser cero ni negativa.

Resultado esperado
  - Si todos los campos cumplen las reglas de negocio: el sistema registra
    el precio por volumen del proveedor y lo asocia al proveedor y producto
    correspondientes.
  - Si el precio de costo es negativo: el sistema muestra el mensaje
    "El precio de costo no puede ser negativo." y no registra el precio.
  - Si la cantidad mínima de aplicación es cero o negativa: el sistema
    muestra el mensaje "La cantidad mínima debe ser mayor a cero." y no
    registra el precio.
─────────────────────────────────────────────────
```

---

### Módulo 7: Reportes

---

```
─────────────────────────────────────────────────
ID:      RF-039
Título:  Dashboard de rendimiento del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor un dashboard con los siguientes
  indicadores para el período seleccionado:
    - Total facturado (suma de los montos de pedidos en estado "Entregado")
    - Cantidad de pedidos en estado "Entregado"
    - Listado de productos más vendidos (por unidades del producto)
    - Listado de productos menos vendidos (por unidades del producto)

Resultado esperado
  - Si existen pedidos en estado "Entregado" en el período seleccionado:
    el sistema muestra el dashboard con todos los indicadores calculados.
  - Si no existen pedidos en estado "Entregado" en el período seleccionado:
    el sistema muestra el dashboard con todos los indicadores en cero o
    vacíos con el mensaje "No hay pedidos completados en el período
    seleccionado."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-040
Título:  Cálculo de rentabilidad por precio por volumen
─────────────────────────────────────────────────
Descripción
  El sistema debe calcular y mostrar al distribuidor la rentabilidad de
  cada precio por volumen de sus productos. Para cada precio por volumen,
  el sistema debe mostrar:
    - Precio de costo registrado
    - Precio de venta aplicado
    - Diferencia en pesos uruguayos (rentabilidad bruta por unidad)
    - Diferencia en porcentaje sobre el precio de costo

Reglas de negocio
  - El cálculo de rentabilidad solo está disponible para precios por volumen
    que tengan precio de costo registrado.
  - Si el precio de costo no está registrado, el sistema muestra un indicador
    de dato faltante en lugar de la rentabilidad.

Resultado esperado
  - Si el precio por volumen tiene precio de costo registrado: el sistema
    muestra la rentabilidad calculada en pesos y en porcentaje.
  - Si el precio por volumen no tiene precio de costo registrado: el sistema
    muestra el indicador "—" con el texto "Sin precio de costo" en lugar
    de los valores de rentabilidad.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-041
Título:  Filtrado de reportes por período
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor filtrar todos los indicadores del
  dashboard seleccionando uno de los siguientes períodos:
    - Día actual
    - Semana actual
    - Mes actual

Reglas de negocio
  - El período seleccionado aplica a todos los indicadores del dashboard
    simultáneamente.
  - El período predeterminado al ingresar al dashboard es el mes actual.

Resultado esperado
  - Si el distribuidor selecciona un período: el sistema recalcula y actualiza
    todos los indicadores del dashboard para ese período.
─────────────────────────────────────────────────
```

---

### Módulo 8: Gestión de Empleados

---

```
─────────────────────────────────────────────────
ID:      RF-042
Título:  Creación de empleado con rol asignado
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al administrador del distribuidor crear una cuenta
  de empleado ingresando:
    - Nombre completo
    - Número de cédula de identidad (sin puntos ni guiones)
    - Número de teléfono
    - Rol asignado

  Al crear el empleado, el sistema debe generar automáticamente una contraseña
  por defecto y enviarla por SMS al número de teléfono del empleado junto con
  la cédula de identidad como dato de acceso.

Reglas de negocio
  - El número de cédula de identidad debe ser único en el sistema.
  - El rol asignado determina las funcionalidades accesibles para ese empleado.
  - Los roles disponibles son: Administrador (acceso completo al panel) y
    Operador (gestión de pedidos y stock; sin acceso a configuración del
    negocio ni gestión de empleados).

Resultado esperado
  - Si los datos son válidos y la cédula no está registrada previamente: el
    sistema crea la cuenta del empleado, genera la contraseña por defecto y
    envía las credenciales por SMS al teléfono del empleado.
  - Si la cédula de identidad ya está registrada en el sistema: el sistema
    muestra el mensaje "Ya existe un empleado registrado con esa cédula de
    identidad." y no crea el empleado.
  - Si algún campo obligatorio está vacío: el sistema muestra el mensaje
    "Completá todos los campos obligatorios antes de continuar." y no crea
    el empleado.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-043
Título:  Inicio de sesión del empleado
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al empleado iniciar sesión ingresando:
    - Número de cédula de identidad sin puntos ni guiones
    - Contraseña asignada

Resultado esperado
  - Si las credenciales son correctas y es el primer inicio de sesión:
    el sistema redirige al empleado al flujo obligatorio de cambio de
    contraseña (RF-044) antes de dar acceso a cualquier otra función.
  - Si las credenciales son correctas y no es el primer inicio de sesión:
    el sistema inicia la sesión del empleado con el rol y los permisos
    asignados.
  - Si las credenciales son incorrectas: el sistema muestra el mensaje
    "La cédula o la contraseña son incorrectas."
  - Si la cuenta del empleado está desactivada: el sistema muestra el
    mensaje "Tu cuenta está desactivada. Contactá al administrador de
    tu distribuidora." y no inicia la sesión.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-044
Título:  Cambio de contraseña obligatorio en primer acceso
─────────────────────────────────────────────────
Descripción
  El sistema debe solicitar al empleado que establezca una nueva contraseña
  personal en reemplazo de la contraseña por defecto, en su primer inicio de
  sesión. El empleado no puede acceder a ninguna otra función del sistema
  hasta completar este paso.

Reglas de negocio
  - La nueva contraseña no puede ser igual a la contraseña por defecto
    asignada.

Resultado esperado
  - Si el empleado ingresa una nueva contraseña válida y distinta a la
    contraseña por defecto: el sistema actualiza la contraseña y da acceso
    al panel del empleado con los permisos de su rol.
  - Si la nueva contraseña coincide con la contraseña por defecto: el sistema
    muestra el mensaje "La nueva contraseña no puede ser igual a la contraseña
    provisoria. Elegí una diferente." y no actualiza la contraseña.
─────────────────────────────────────────────────
```

---

### Módulo 9: Exportación de Datos

---

```
─────────────────────────────────────────────────
ID:      RF-045
Título:  Exportación de datos del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor descargar sus datos en un archivo
  exportable. El distribuidor debe poder seleccionar qué conjunto de datos
  exportar:
    - Pedidos (historial completo)
    - Productos (catálogo con precios por volumen)
    - Stock (estado actual del inventario)

Reglas de negocio
  - El archivo exportado debe estar en formato CSV (valores separados por
    comas) con codificación UTF-8, compatible con Microsoft Excel y Google
    Sheets sin conversión adicional.

Resultado esperado
  - Si el distribuidor selecciona al menos un conjunto de datos y confirma
    la exportación: el sistema genera el archivo y lo descarga en el
    dispositivo del distribuidor.
  - Si el distribuidor no selecciona ningún conjunto de datos: el sistema
    muestra el mensaje "Seleccioná al menos un conjunto de datos para
    exportar." y no genera el archivo.
─────────────────────────────────────────────────
```

---

### Módulo 10: Planificación de Reparto

---

```
─────────────────────────────────────────────────
ID:      RF-046
Título:  Registro de dirección de partida del depósito
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor registrar la dirección de partida
  de su depósito o punto de salida. Esta dirección se usa como referencia
  geográfica para el cálculo de distancias en la planificación de reparto.

Resultado esperado
  - Si la dirección ingresada no está vacía: el sistema la registra y la
    muestra en el panel de configuración del distribuidor.
  - Si el campo de dirección está vacío: el sistema muestra el mensaje
    "Ingresá la dirección de partida antes de guardar." y no registra
    la dirección.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-047
Título:  Selección de pedidos para planificación de reparto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor seleccionar, entre los pedidos
  en estado "Aceptado" que tienen dirección de entrega registrada, cuáles
  incluir en una nueva planificación de reparto.

Reglas de negocio
  - Solo pueden incluirse en la planificación pedidos en estado "Aceptado"
    con dirección de entrega registrada.
  - Deben seleccionarse al menos dos pedidos para habilitar la generación
    del plan.

Resultado esperado
  - Si el distribuidor selecciona dos o más pedidos válidos: el sistema
    habilita el control de generación del plan de carga.
  - Si el distribuidor selecciona menos de dos pedidos: el sistema muestra
    el mensaje "Seleccioná al menos dos pedidos para generar la
    planificación." y no habilita la generación.
  - Si no existen pedidos en estado "Aceptado" con dirección de entrega
    registrada: el sistema muestra el mensaje
    "No hay pedidos aceptados con dirección de entrega registrada."
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-048
Título:  Generación del plan de carga por IA
─────────────────────────────────────────────────
Descripción
  El sistema debe generar, mediante un modelo de inteligencia artificial,
  el plan de carga del camión ordenando los pedidos seleccionados de mayor
  a menor distancia desde la dirección de partida del depósito del
  distribuidor.

Reglas de negocio
  - El distribuidor debe tener registrada su dirección de partida para
    habilitar la generación del plan.
  - Deben haberse seleccionado al menos dos pedidos con dirección de entrega
    registrada.

Resultado esperado
  - Si se cumplen ambas condiciones: el sistema genera el plan de carga con
    los pedidos ordenados y muestra la lista de reparto (RF-049).
  - Si la dirección de partida del distribuidor no está registrada: el sistema
    muestra el mensaje "Registrá la dirección de partida del depósito antes
    de generar el plan." y no genera el plan.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-049
Título:  Visualización de lista de reparto con acceso a ruta
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor la lista de clientes en el orden
  de entrega resultante del plan de carga generado. Para cada cliente,
  el sistema debe mostrar:
    - Nombre del comprador
    - Dirección de entrega
    - Lista de productos del pedido correspondiente con cantidad en la
      unidad del producto
    - Botón "Ver ruta" que abre Google Maps con la dirección del cliente
      como destino

Resultado esperado
  - Si el plan de reparto fue generado: el sistema muestra la lista completa
    de clientes en el orden calculado con todos los datos indicados.
  - Si el distribuidor presiona "Ver ruta" para un cliente: el sistema abre
    Google Maps con la dirección de ese cliente como destino.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-050
Título:  Marcación de parada en plan de reparto
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor marcar el estado de cada parada
  en el plan de reparto activo. Las acciones disponibles por parada son:
    - Entregado: actualiza el estado del pedido correspondiente a
      "Entregado" en el sistema principal y descuenta el stock reservado
    - Omitido: registra la parada como omitida sin modificar el estado
      del pedido en el sistema principal
    - Rechazado: solicita al distribuidor un motivo de rechazo en texto
      libre, actualiza el estado del pedido correspondiente a "Rechazado"
      en el sistema principal y libera el stock reservado

Reglas de negocio
  - Una parada marcada no puede desmarcarse desde la interfaz de
    planificación de reparto.
  - El plan de reparto debe estar activo para que las acciones sobre
    paradas estén disponibles.
  - La transición a "Rechazado" desde el plan de reparto aplica a pedidos
    en estado "En camino", conforme a lo definido en RF-026.
  - El motivo de rechazo es obligatorio al marcar una parada como
    "Rechazado". El stock reservado queda liberado al confirmar el rechazo.

Resultado esperado
  - Si el distribuidor marca una parada como "Entregado": el sistema
    actualiza el estado del pedido a "Entregado" en el sistema principal,
    descuenta el stock reservado y envía la notificación al comprador
    (RF-029).
  - Si el distribuidor marca una parada como "Omitido": el sistema registra
    la parada como omitida y mantiene el estado del pedido sin cambios.
  - Si el distribuidor ingresa un motivo y marca una parada como
    "Rechazado": el sistema actualiza el estado del pedido a "Rechazado"
    con el motivo ingresado, libera el stock reservado y envía la
    notificación al comprador (RF-029).
  - Si el distribuidor intenta confirmar el rechazo sin ingresar motivo:
    el sistema muestra el mensaje "Ingresá un motivo de rechazo antes de
    confirmar." y no procesa el rechazo.
─────────────────────────────────────────────────
```

---

### Módulo 11: Sesión

---

```
─────────────────────────────────────────────────
ID:      RF-051
Título:  Cierre de sesión del usuario
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir a cualquier usuario autenticado (comprador,
  distribuidor o empleado) cerrar su sesión activa mediante un control
  visible en la interfaz.

Reglas de negocio
  - Al cerrar sesión, el sistema invalida la sesión activa del usuario
    de forma inmediata.
  - El carrito del comprador se conserva entre sesiones para el mismo
    usuario autenticado.

Resultado esperado
  - Si el usuario cierra sesión: el sistema invalida la sesión, borra los
    datos de sesión del dispositivo y redirige al usuario a la pantalla
    de inicio de sesión.
─────────────────────────────────────────────────
```

---

### Módulo 12: Perfil del distribuidor

---

```
─────────────────────────────────────────────────
ID:      RF-052
Título:  Configuración inicial del perfil del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe solicitar al usuario la configuración de su perfil de
  distribuidor la primera vez que accede al modo distribuidor tras activarlo
  (RF-012). El sistema debe registrar:
    - Nombre comercial de la distribuidora
    - Descripción del negocio
    - Zona de entrega

Reglas de negocio
  - El nombre comercial no puede estar vacío.
  - El distribuidor no puede acceder al panel de distribuidor hasta completar
    este paso por primera vez.

Resultado esperado
  - Si todos los campos obligatorios son completados: el sistema registra el
    perfil y da acceso al panel del distribuidor.
  - Si el nombre comercial está vacío: el sistema muestra el mensaje
    "El nombre comercial es obligatorio para continuar." y no avanza al panel.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-053
Título:  Edición del perfil del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al distribuidor editar los datos de su perfil
  público desde el panel de configuración. Los datos editables son:
    - Nombre comercial
    - Descripción del negocio
    - Zona de entrega

Reglas de negocio
  - El nombre comercial no puede quedar vacío.
  - Los cambios aplicados se reflejan de inmediato en el perfil público
    del distribuidor (RF-004).

Resultado esperado
  - Si los nuevos datos son válidos: el sistema actualiza el perfil y
    muestra la confirmación al distribuidor.
  - Si el nombre comercial queda vacío: el sistema muestra el mensaje
    "El nombre comercial no puede quedar vacío." y no aplica los cambios.
─────────────────────────────────────────────────
```

---

### Módulo 13: Recuperación de contraseña del empleado

---

```
─────────────────────────────────────────────────
ID:      RF-054
Título:  Recuperación de contraseña del empleado
─────────────────────────────────────────────────
Descripción
  El sistema debe permitir al empleado con cuenta activa recuperar su
  contraseña. El sistema debe:
    - Solicitar el número de cédula de identidad del empleado
    - Enviar un código de verificación por SMS al número de teléfono
      registrado para ese empleado
    - Permitir al empleado establecer una nueva contraseña tras ingresar
      el código correcto

Reglas de negocio
  - El código SMS de recuperación tiene validez de 10 minutos.
  - Una vez establecida la nueva contraseña, el código de recuperación
    queda inválido.

Resultado esperado
  - Si la cédula de identidad está registrada en el sistema: el sistema
    envía el código SMS al número de teléfono del empleado y muestra
    el campo para ingresarlo.
  - Si el código SMS es correcto: el sistema habilita el campo para ingresar
    la nueva contraseña.
  - Si la nueva contraseña es confirmada correctamente: el sistema actualiza
    la contraseña y redirige al inicio de sesión con el mensaje
    "Tu contraseña fue actualizada correctamente."
  - Si la cédula de identidad no está registrada: el sistema muestra el
    mensaje "No encontramos un empleado con esa cédula de identidad."
  - Si el código SMS es incorrecto: el sistema muestra el mensaje
    "El código ingresado no es válido. Intentá de nuevo."
─────────────────────────────────────────────────
```

---

### Módulo 14: Panel de pedidos activos del distribuidor

---

```
─────────────────────────────────────────────────
ID:      RF-055
Título:  Panel de pedidos activos del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor un panel con todos los pedidos
  en estado "Pendiente", "Aceptado" o "En camino". Para cada pedido, el
  sistema debe mostrar:
    - Número del pedido
    - Estado actual
    - Nombre del comprador
    - Fecha de creación
    - Lista de productos solicitados con cantidad en la unidad del producto
    - Stock disponible de cada producto al momento de la consulta,
      expresado en la unidad correspondiente al tipo de producto
    - Acciones disponibles según el estado del pedido:
        · Si "Pendiente": Aceptar, Rechazar, Proponer sustituto
        · Si "Aceptado": Marcar como En camino
        · Si "En camino": Marcar como Entregado

Reglas de negocio
  - Solo se muestran pedidos que no han alcanzado el estado "Entregado"
    ni "Rechazado".
  - Las acciones disponibles dependen del estado actual del pedido.

Resultado esperado
  - Si el distribuidor tiene pedidos activos: el sistema muestra el panel
    con todos los pedidos activos y sus acciones correspondientes.
  - Si el distribuidor no tiene pedidos activos: el sistema muestra el
    mensaje "No tenés pedidos activos en este momento."
─────────────────────────────────────────────────
```

---

### Módulo 15: Detalle de pedido individual

---

```
─────────────────────────────────────────────────
ID:      RF-056
Título:  Vista de detalle de pedido del comprador
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al comprador autenticado el detalle completo de
  un pedido específico al seleccionarlo desde su historial (RF-032). El
  sistema debe mostrar:
    - Número del pedido
    - Nombre del distribuidor
    - Estado actual
    - Fecha de creación
    - Dirección de entrega registrada
    - Lista de productos solicitados con cantidad en la unidad del producto
      y precio unitario al momento de la confirmación
    - Acción disponible si el distribuidor propuso una sustitución:
      Aceptar sustitución / Rechazar sustitución

Resultado esperado
  - Si el comprador selecciona un pedido de su historial: el sistema muestra
    el detalle completo con todos los campos indicados.
  - Si el pedido tiene una propuesta de sustitución pendiente de respuesta:
    el sistema muestra las opciones de Aceptar y Rechazar activas para
    ese artículo.
  - Si el pedido no tiene propuestas pendientes: el sistema muestra el
    detalle sin acciones adicionales.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-057
Título:  Vista de detalle de pedido del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor el detalle completo de un pedido
  específico al seleccionarlo desde el panel de pedidos activos (RF-055)
  o desde el historial (RF-031). El sistema debe mostrar:
    - Número del pedido
    - Estado actual
    - Nombre del comprador
    - Número de teléfono del comprador
    - Dirección de entrega
    - Fecha de creación
    - Lista de productos solicitados con cantidad en la unidad del producto
      y precio de venta al momento de la confirmación
    - Stock disponible y reservado de cada producto al momento de la
      consulta, expresado en la unidad correspondiente al tipo de producto
    - Acciones disponibles según el estado (según RF-055)

Resultado esperado
  - Si el distribuidor selecciona un pedido: el sistema muestra el detalle
    completo con todos los campos indicados y las acciones correspondientes
    al estado actual del pedido.
─────────────────────────────────────────────────
```

---

### Módulo 16: Listas de gestión

---

```
─────────────────────────────────────────────────
ID:      RF-058
Título:  Lista de proveedores del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al distribuidor el listado de sus proveedores
  registrados. Para cada proveedor, el sistema debe mostrar:
    - Nombre del proveedor
    - Número de teléfono de WhatsApp

  Desde esta vista, el distribuidor debe poder iniciar el armado de un
  pedido de reposición para ese proveedor (RF-036).

Resultado esperado
  - Si el distribuidor tiene proveedores registrados: el sistema muestra
    el listado completo con los datos indicados y el acceso a RF-036.
  - Si el distribuidor no tiene proveedores registrados: el sistema muestra
    el mensaje "Aún no registraste proveedores." y un acceso directo
    a RF-034 para registrar el primero.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:      RF-059
Título:  Lista de empleados del distribuidor
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al administrador del distribuidor el listado de
  empleados creados para su distribuidora. Para cada empleado, el sistema
  debe mostrar:
    - Nombre completo
    - Número de cédula de identidad
    - Rol asignado
    - Estado de la cuenta (activa / desactivada)

  Desde esta vista, el administrador debe poder desactivar o reactivar la
  cuenta de un empleado.

Reglas de negocio
  - Un empleado desactivado no puede iniciar sesión en el sistema.
  - Desactivar un empleado no elimina su registro; el historial de
    acciones permanece.
  - Al reactivar un empleado, recupera los permisos de su rol sin
    necesidad de volver a configurarlos.

Resultado esperado
  - Si el distribuidor tiene empleados registrados: el sistema muestra el
    listado completo con todos los datos indicados.
  - Si el administrador desactiva un empleado: el sistema actualiza el
    estado de esa cuenta a "desactivada" y el empleado pierde el acceso
    de forma inmediata.
  - Si el administrador reactiva un empleado: el sistema actualiza el
    estado de esa cuenta a "activa" y el empleado recupera el acceso con
    los permisos de su rol.
  - Si el distribuidor no tiene empleados registrados: el sistema muestra
    el mensaje "Aún no creaste accesos para empleados." y un acceso directo
    a RF-042.
─────────────────────────────────────────────────
```

---

### Módulo 17: Notificaciones del comprador

---

```
─────────────────────────────────────────────────
ID:      RF-060
Título:  Centro de notificaciones del comprador
─────────────────────────────────────────────────
Descripción
  El sistema debe mostrar al comprador autenticado un listado de sus
  notificaciones recibidas, ordenadas de más reciente a más antigua. Para
  cada notificación, el sistema debe mostrar:
    - Número del pedido al que refiere
    - Nuevo estado del pedido
    - Motivo de rechazo (únicamente cuando el estado sea "Rechazado")
    - Fecha y hora de la notificación
    - Indicador visual de si fue leída o no

  Desde cada notificación, el comprador debe poder acceder al detalle del
  pedido correspondiente (RF-056).

Reglas de negocio
  - Una notificación se marca como leída cuando el comprador la abre o
    accede al detalle del pedido correspondiente.
  - El mecanismo de notificación es in-app, consistente con lo definido
    en RF-029. Las notificaciones se almacenan en el sistema y son accesibles
    desde esta vista. Si en el futuro se incorpora un canal externo (SMS o
    push), este RF debe actualizarse para reflejar el canal adicional.

Resultado esperado
  - Si el comprador tiene notificaciones: el sistema muestra el listado
    completo con todos los campos indicados.
  - Si el comprador no tiene notificaciones: el sistema muestra el mensaje
    "No tenés notificaciones."
  - Si el comprador abre una notificación no leída: el sistema la marca
    como leída y muestra el detalle del pedido correspondiente.
─────────────────────────────────────────────────
```

---

## BLOQUE B — REQUERIMIENTOS NO FUNCIONALES (RNF)

---

```
─────────────────────────────────────────────────
ID:          RNF-001
Título:      Tiempo de respuesta del catálogo
Categoría:   Rendimiento
─────────────────────────────────────────────────
Restricción
  El sistema debe mostrar el catálogo de productos en menos de 3 segundos
  bajo condiciones de uso normal (una sesión activa, conexión estándar
  de banda ancha).

Condición de verificación
  Acceder al catálogo desde un navegador sin sesión en caché con conexión
  de banda ancha estándar. Medir el tiempo hasta la visualización completa
  del listado de productos. El tiempo debe ser menor a 3 segundos en al
  menos 9 de cada 10 mediciones.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-002
Título:      Tiempo de respuesta bajo carga concurrente
Categoría:   Rendimiento
─────────────────────────────────────────────────
Restricción
  El sistema debe mantener un tiempo de respuesta menor a 5 segundos para
  operaciones de consulta de catálogo y gestión de pedidos con al menos
  50 usuarios simultáneos.

Condición de verificación
  Ejecutar prueba de carga con herramienta de stress testing simulando 50
  usuarios concurrentes realizando consultas de catálogo y operaciones de
  gestión de pedidos. Registrar el tiempo de respuesta promedio y el
  percentil 95. Ambos valores deben ser menores a 5 segundos.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-003
Título:      Cifrado de contraseñas almacenadas
Categoría:   Seguridad
─────────────────────────────────────────────────
Restricción
  El sistema debe almacenar todas las contraseñas de usuarios aplicando
  un algoritmo de hash con salt. Las contraseñas no deben almacenarse ni
  transmitirse en texto plano en ningún punto del sistema.

Condición de verificación
  Inspeccionar el campo de contraseña en la base de datos: el valor
  almacenado no debe ser legible como texto. Inspeccionar los registros
  del servidor: ningún log debe contener contraseñas en texto plano.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-004
Título:      Comunicación cifrada mediante HTTPS
Categoría:   Seguridad
─────────────────────────────────────────────────
Restricción
  Toda comunicación entre el cliente y el servidor debe realizarse
  exclusivamente a través de HTTPS con certificado SSL activo. El sistema
  no debe responder solicitudes HTTP sin cifrar.

Condición de verificación
  Verificar el certificado SSL del dominio con una herramienta de auditoría
  (p. ej., SSL Labs). Realizar una solicitud HTTP al dominio y verificar
  que el servidor redirige a HTTPS o rechaza la solicitud sin procesar
  datos.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-005
Título:      Control de acceso por rol de usuario
Categoría:   Seguridad
─────────────────────────────────────────────────
Restricción
  El sistema debe impedir el acceso a funciones restringidas a usuarios que
  no cuenten con el rol o modo correspondiente:
    - Las funciones del modo distribuidor son inaccesibles para usuarios en
      modo comprador.
    - Las funciones del modo comprador (historial, carrito, checkout) son
      inaccesibles para usuarios no autenticados.
    - Las funciones de empleado requieren sesión de empleado activa.
    - Las funciones de administrador (crear empleados) requieren rol de
      administrador activo.

Condición de verificación
  Intentar acceder a las rutas del panel de distribuidor, historial de
  comprador y creación de empleados con sesiones de roles no autorizados.
  El sistema debe denegar el acceso en todos los casos y devolver el error
  correspondiente sin revelar información del recurso protegido.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-006
Título:      Disponibilidad en horario laboral
Categoría:   Disponibilidad
─────────────────────────────────────────────────
Restricción
  El sistema debe mantenerse operativo de lunes a sábado de 8:00 a 20:00
  (hora de Uruguay), con un tiempo máximo de interrupción no planificada
  de 2 horas por mes en ese horario.

Condición de verificación
  Monitorear el uptime del sistema durante la fase de implementación con
  una herramienta de supervisión externa. Registrar las interrupciones no
  planificadas ocurridas en horario laboral durante un mes. El total
  acumulado no debe superar 2 horas.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-007
Título:      Completar flujos clave sin asistencia técnica
Categoría:   Usabilidad
─────────────────────────────────────────────────
Restricción
  Un distribuidor sin experiencia previa en el sistema debe ser capaz de
  completar, en una sola sesión de entre 15 y 30 minutos, los siguientes
  tres flujos sin intervención del equipo de desarrollo:
    1. Registro de cuenta y activación del modo distribuidor
    2. Carga y publicación del primer producto con al menos un precio
       por volumen definido
    3. Aceptación de un pedido de prueba

Condición de verificación
  Realizar la prueba con al menos dos usuarios reales de las distribuidoras
  de referencia (Distribuidora El Mercado y Distribuidora FerminSur), sin
  intervención del equipo de desarrollo durante la sesión. Los tres flujos
  deben completarse dentro del tiempo establecido.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-008
Título:      Compatibilidad con navegadores principales
Categoría:   Portabilidad
─────────────────────────────────────────────────
Restricción
  El sistema debe funcionar correctamente en las versiones vigentes de
  Chrome, Firefox y Safari, tanto desde dispositivos de escritorio como
  desde dispositivos móviles.

Condición de verificación
  Ejecutar los flujos críticos del sistema (registro de cuenta, carga de
  producto, confirmación de pedido desde comprador, aceptación de pedido
  desde distribuidor) en las versiones actuales de Chrome, Firefox y Safari
  en escritorio y dispositivo móvil. Todos los flujos deben completarse
  sin errores en cada combinación de navegador y dispositivo.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-009
Título:      Escalabilidad de la arquitectura
Categoría:   Mantenibilidad
─────────────────────────────────────────────────
Restricción
  La arquitectura del sistema debe permitir incorporar nuevos distribuidores
  y mayor volumen de operaciones sin requerir cambios en la estructura del
  modelo de datos ni en la arquitectura de capas del sistema.

Condición de verificación
  Revisión de diseño: el modelo de datos no debe contener límites fijos de
  registros codificados en el esquema (p. ej., sin columnas de cantidad fija
  de distribuidores). La arquitectura de capas no debe imponer restricciones
  estáticas en el número de distribuidores, productos o pedidos permitidos.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-010
Título:      Cumplimiento de la Ley 18.331 (protección de datos)
Categoría:   Legal / Normativo
─────────────────────────────────────────────────
Restricción
  El sistema debe cumplir con la Ley N.° 18.331 de Uruguay (Protección de
  Datos Personales):
    - Obtener consentimiento explícito del usuario al registrarse, mediante
      una casilla de aceptación no pre-marcada.
    - Informar el propósito del tratamiento de datos en el momento del
      registro.
    - Proveer un mecanismo para que el usuario solicite el acceso, la
      rectificación o la eliminación de sus datos personales.

Condición de verificación
  Verificar que el formulario de registro incluye una casilla de
  consentimiento que no está pre-marcada. Verificar que existe y está
  documentado el mecanismo para solicitudes de acceso, corrección y
  eliminación de datos. Verificar que los datos personales almacenados
  están protegidos con las medidas definidas en RNF-003 y RNF-004.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-011
Título:      Cumplimiento de la Ley 17.250 (relaciones de consumo)
Categoría:   Legal / Normativo
─────────────────────────────────────────────────
Restricción
  Los términos de uso del sistema deben establecer de forma explícita que
  el sistema actúa como intermediario y que la responsabilidad sobre la
  calidad del producto y el cumplimiento de la entrega recae sobre el
  distribuidor.

Condición de verificación
  Verificar que los términos de uso son accesibles desde la pantalla de
  registro. Verificar que el texto de los términos incluye la cláusula de
  intermediación y la asignación explícita de responsabilidad al distribuidor
  por la calidad del producto y la entrega.
─────────────────────────────────────────────────
```

---

```
─────────────────────────────────────────────────
ID:          RNF-012
Título:      Integración con WhatsApp mediante deep links
Categoría:   Integración
─────────────────────────────────────────────────
Restricción
  La integración del sistema con WhatsApp debe realizarse exclusivamente
  mediante enlaces del formato wa.me/?text=... (deep links). El sistema no
  debe utilizar la API oficial de WhatsApp Business de Meta en ningún flujo.

  Nota: Esta es una restricción impuesta por el contexto del proyecto
  (la aprobación empresarial de Meta no está disponible en la etapa inicial),
  no una decisión de diseño del equipo.

Condición de verificación
  Verificar que el sistema no contiene llamadas a la API oficial de WhatsApp
  Business. Ejecutar los flujos de aceptación de pedido (RF-025) y
  confirmación de reposición (RF-037), y verificar que WhatsApp se abre con
  el mensaje pre-redactado a través de un deep link wa.me.
─────────────────────────────────────────────────
```

---

## Tabla de trazabilidad V6 → V7

| ID V7 | ID V6 | Tipo de cambio |
|---|---|---|
| RF-001 a RF-014 | RF-001 a RF-014 | Sin cambios |
| RF-015 | RF-015 (parcial) | Separación: cubre únicamente el registro de un nuevo precio por volumen. Disponible al crear el producto o posteriormente. Se separa el resultado esperado de precio de costo negativo que antes no tenía mensaje propio. |
| RF-016 | RF-015 (parcial) | Nuevo RF separado: edición de precio por volumen ya registrado. Cubre tres resultados de error con mensajes exactos. |
| RF-017 | RF-015 (parcial) | Nuevo RF separado: eliminación de precio por volumen. Cubre dos restricciones de eliminación con mensajes exactos y un resultado de éxito con mensaje de confirmación. |
| RF-018 | RF-016 | Renumerado +2; sin cambios de contenido |
| RF-019 | RF-017 | Renumerado +2; sin cambios de contenido |
| RF-020 | RF-018 | Renumerado +2; sin cambios de contenido |
| RF-021 | RF-019 | Renumerado +2; sin cambios de contenido |
| RF-022 | RF-020 | Renumerado +2; sin cambios de contenido |
| RF-023 | RF-021 | Renumerado +2; sin cambios de contenido |
| RF-024 | RF-022 | Renumerado +2; sin cambios de contenido |
| RF-025 | RF-023 | Renumerado +2; sin cambios de contenido |
| RF-026 | RF-024 | Renumerado +2; sin cambios de contenido |
| RF-027 | RF-025 | Renumerado +2; sin cambios de contenido |
| RF-028 | RF-026 | Renumerado +2; sin cambios de contenido |
| RF-029 | RF-027 | Renumerado +2; sin cambios de contenido |
| RF-030 | RF-028 | Renumerado +2; sin cambios de contenido |
| RF-031 | RF-029 | Renumerado +2; sin cambios de contenido |
| RF-032 | RF-030 | Renumerado +2; sin cambios de contenido |
| RF-033 | RF-031 | Renumerado +2; sin cambios de contenido |
| RF-034 | RF-032 | Renumerado +2; sin cambios de contenido |
| RF-035 | RF-033 | Renumerado +2; sin cambios de contenido |
| RF-036 | RF-034 | Renumerado +2; sin cambios de contenido |
| RF-037 | RF-035 | Renumerado +2; sin cambios de contenido |
| RF-038 | RF-036 | Renumerado +2; sin cambios de contenido |
| RF-039 | RF-037 | Renumerado +2; sin cambios de contenido |
| RF-040 | RF-038 | Renumerado +2; sin cambios de contenido |
| RF-041 | RF-039 | Renumerado +2; sin cambios de contenido |
| RF-042 | RF-040 | Renumerado +2; sin cambios de contenido |
| RF-043 | RF-041 | Renumerado +2; sin cambios de contenido |
| RF-044 | RF-042 | Renumerado +2; sin cambios de contenido |
| RF-045 | RF-043 | Renumerado +2; sin cambios de contenido |
| RF-046 | RF-044 | Renumerado +2; sin cambios de contenido |
| RF-047 | RF-045 | Renumerado +2; sin cambios de contenido |
| RF-048 | RF-046 | Renumerado +2; sin cambios de contenido |
| RF-049 | RF-047 | Renumerado +2; sin cambios de contenido |
| RF-050 | RF-048 | Renumerado +2; sin cambios de contenido |
| RF-051 | RF-049 | Renumerado +2; sin cambios de contenido |
| RF-052 | RF-050 | Renumerado +2; sin cambios de contenido |
| RF-053 | RF-051 | Renumerado +2; sin cambios de contenido |
| RF-054 | RF-052 | Renumerado +2; sin cambios de contenido |
| RF-055 | RF-053 | Renumerado +2; sin cambios de contenido |
| RF-056 | RF-054 | Renumerado +2; sin cambios de contenido |
| RF-057 | RF-055 | Renumerado +2; sin cambios de contenido |
| RF-058 | RF-056 | Renumerado +2; sin cambios de contenido |
| RF-059 | RF-057 | Renumerado +2; sin cambios de contenido |
| RF-060 | RF-058 | Renumerado +2; sin cambios de contenido |
| RNF-001 a RNF-012 | RNF-001 a RNF-012 | Sin cambios |
