# MER — Marketplace Mayorista (DBML)

Modelo entidad-relación construido a partir de la Sección 1.8 (Lista de Requerimientos, V8), siguiendo la guía estándar para construir un MER en DBML. Versión 1: previa a la fase de prueba contra requerimientos.

```dbml
Project marketplace_mayorista {
  database_type: 'PostgreSQL'
  Note: 'MER del marketplace mayorista. Construido a partir de la Sección 1.8 (Lista de Requerimientos, V8) según la Guía estándar para construir un MER en DBML. Versión 1: previa a la fase de prueba contra requerimientos.'
}

// ============================================================
// MÓDULO: CUENTA Y ACCESO (RF-009 a RF-013, RF-051)
// ============================================================

Table usuario {
  id integer [pk, increment]
  nombre_completo varchar [not null]
  telefono varchar [unique, not null, note: 'Identificador de acceso para el modo comprador. Único en el sistema (RF-009).']
  contrasena_hash varchar [not null, note: 'Almacenada con hash y salt, nunca en texto plano (RNF-003).']
  modo_distribuidor_activo boolean [not null, default: false, note: 'Indica si el usuario activó el modo distribuidor (RF-012). Solo puede haber un modo distribuidor por cuenta.']
  cuenta_verificada boolean [not null, default: false, note: 'false hasta confirmar el código SMS de activación (RF-009).']
  consentimiento_datos_otorgado boolean [not null, default: false, note: 'Registra si el usuario aceptó la casilla de consentimiento de tratamiento de datos personales al registrarse, exigida por la Ley 18.331 de Uruguay (RNF-010). No pre-marcada por defecto; debe quedar en true antes de completar el registro. Sin esta columna no habría forma de acreditar ante una auditoría que el consentimiento fue otorgado.']
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Representa la cuenta única que puede operar en modo comprador y, opcionalmente, también en modo distribuidor (RF-012, RF-013). No existen tablas separadas "comprador" y "distribuidor_usuario" porque ambos modos pertenecen a la misma cuenta.'
}

Table codigo_verificacion {
  id integer [pk, increment]
  usuario_id integer [ref: > usuario.id, not null]
  codigo varchar [not null]
  proposito codigo_verificacion_proposito [not null]
  fecha_expiracion timestamp [not null, note: 'Vigencia de 10 minutos desde su creación (RF-009, RF-011).']
  usado boolean [not null, default: false]
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Códigos SMS de activación de cuenta (RF-009) y de recuperación de contraseña (RF-011). Se modelan en una sola tabla porque comparten exactamente la misma estructura y reglas de vigencia; el campo proposito distingue el caso de uso.'
}

Enum codigo_verificacion_proposito {
  activacion_cuenta
  recuperacion_password
}

// ============================================================
// MÓDULO: PERFIL DEL DISTRIBUIDOR (RF-004, RF-046, RF-052, RF-053)
// ============================================================

Table distribuidor {
  id integer [pk, increment]
  usuario_id integer [ref: - usuario.id, not null, unique, note: 'Relación uno a uno: el modo distribuidor pertenece a exactamente una cuenta de usuario, y una cuenta tiene como máximo un perfil de distribuidor (RF-012 impide activar el modo dos veces).']
  nombre_comercial varchar [not null]
  descripcion_negocio text
  zona_entrega varchar
  direccion_partida varchar [note: 'Dirección de salida del depósito, usada como referencia para el plan de reparto (RF-046). Puede estar vacía hasta que el distribuidor la registre.']
  perfil_configurado boolean [not null, default: false, note: 'false hasta completar RF-052 por primera vez; bloquea el acceso al panel mientras sea false.']
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Perfil de negocio del distribuidor (RF-004, RF-052, RF-053). Separado de usuario en una relación 1:1 porque es un módulo opcional que no toda cuenta activa, justificando la excepción a la regla de "no usar 1:1 salvo razón explícita".'
}

// ============================================================
// MÓDULO: EMPLEADOS (RF-042, RF-043, RF-044, RF-054, RF-059)
// ============================================================

Table empleado {
  id integer [pk, increment]
  distribuidor_id integer [ref: > distribuidor.id, not null, note: 'Un empleado pertenece a exactamente un distribuidor (confirmado: relación fija, sin posibilidad de pertenecer a varios).']
  nombre_completo varchar [not null]
  cedula_identidad varchar [unique, not null, note: 'Sin puntos ni guiones (RF-042). Identificador de acceso del empleado, único en el sistema.']
  telefono varchar [not null]
  rol empleado_rol [not null]
  contrasena_hash varchar [not null]
  debe_cambiar_contrasena boolean [not null, default: true, note: 'true tras la creación; obliga el flujo de RF-044 antes de cualquier otra acción.']
  cuenta_activa boolean [not null, default: true, note: 'Un empleado desactivado no puede iniciar sesión (RF-059), pero su historial permanece.']
  fecha_creacion timestamp [not null, default: `now()`]
}

Enum empleado_rol {
  administrador
  operador
}

Table codigo_verificacion_empleado {
  id integer [pk, increment]
  empleado_id integer [ref: > empleado.id, not null]
  codigo varchar [not null]
  fecha_expiracion timestamp [not null, note: 'Vigencia de 10 minutos (RF-054).']
  usado boolean [not null, default: false]
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Códigos de recuperación de contraseña del empleado (RF-054). Se separa de codigo_verificacion porque referencia a empleado, no a usuario: son identidades distintas con tablas distintas.'
}

// ============================================================
// MÓDULO: CATEGORÍAS Y PRODUCTOS (RF-014, RF-019, RF-020, RF-021, RF-022)
// ============================================================

Table categoria {
  id integer [pk, increment]
  nombre varchar [unique, not null]

  Note: 'Lista predefinida por el sistema (RF-014: "debe seleccionarse de una lista predefinida"). No se infiere ni se crea desde el alta de producto.'
}

Table producto {
  id integer [pk, increment]
  distribuidor_id integer [ref: > distribuidor.id, not null]
  categoria_id integer [ref: > categoria.id, not null]
  nombre varchar [not null]
  descripcion text
  imagen_url varchar [note: 'Si es nula, el catálogo muestra una imagen de reemplazo predeterminada (RF-001); el reemplazo es una regla de presentación, no un dato almacenado.']
  tipo_producto producto_tipo [not null, note: 'No puede modificarse una vez que el producto tiene al menos un pedido registrado en cualquier estado (RF-019).']
  estado_visibilidad producto_estado [not null, default: 'pausado']
  habilitado boolean [not null, default: true, note: 'false cuando el distribuidor intenta eliminar el producto pero existen pedido_item, propuesta_sustitucion, precio_volumen_proveedor o pedido_reposicion_item que lo referencian (RF-020): en ese caso el registro se conserva y solo se deshabilita, en vez de ejecutar DELETE. Al deshabilitar, estado_visibilidad pasa a "pausado" en el mismo UPDATE (confirmado): por eso un producto nunca queda con habilitado=false y estado_visibilidad="publicado" simultáneamente, y el filtro de catálogo (RF-001, RF-018, RF-023) no necesita ninguna condición adicional sobre habilitado. Un producto deshabilitado sigue siendo visible (con indicador "No disponible") en todo historial de pedidos que lo referencia. Si la verificación confirma que ninguna tabla lo referencia, el producto se elimina físicamente y esta columna deja de aplicar.']

  // --- Atributos exclusivos de producto Empaquetado (RF-014) ---
  descripcion_unidad_venta varchar [note: 'Solo aplica si tipo_producto = empaquetado. Ej: "caja de 12 latas".']
  cantidad_minima_compra decimal [not null, note: 'Unidades enteras si Empaquetado; unidad de visualización si Fraccionable. No puede ser cero ni negativa (RF-014).']

  // --- Atributos exclusivos de producto Fraccionable (RF-014, RF-021) ---
  unidad_base_interna producto_unidad_base [note: 'Solo aplica si tipo_producto = fraccionable: gramo, mililitro o centimetro.']
  incremento_venta decimal [note: 'Solo aplica si tipo_producto = fraccionable. Múltiplo mínimo aceptado, expresado en unidad de visualización. No puede ser cero ni negativo (RF-014).']
  metrica_visualizacion producto_metrica_visualizacion [note: 'Solo aplica si tipo_producto = fraccionable: kilogramos, litros o metros, determinada por unidad_base_interna (RF-014).']

  // --- Stock (RF-014, RF-021) ---
  stock_total integer [not null, default: 0, note: 'Almacenado siempre como entero. Para Fraccionables representa unidades de la unidad_base_interna (gramo/mililitro/centímetro); para Empaquetados, unidades enteras del producto.']
  stock_reservado integer [not null, default: 0, note: 'Unidades comprometidas en pedidos en estado Aceptado pendientes de entrega (RF-021). stock_disponible se calcula como stock_total - stock_reservado, no se almacena por separado para evitar duplicar un dato derivable.']
  umbral_minimo_stock integer [note: 'Configurado por el distribuidor (RF-022). No puede ser negativo.']

  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Las columnas exclusivas de cada tipo (Empaquetado vs. Fraccionable) se mantienen en la misma tabla porque dividir en dos tablas obligaría a un join adicional en cada operación de catálogo (RF-001, RF-005) sin que ningún requerimiento exija separarlas; el costo de columnas nulas según el tipo es menor que la complejidad de una jerarquía de tablas que ningún RF pide.'
}

Enum producto_tipo {
  empaquetado
  fraccionable
}

Enum producto_estado {
  publicado
  pausado
}

Enum producto_unidad_base {
  gramo
  mililitro
  centimetro
}

Enum producto_metrica_visualizacion {
  kilogramos
  litros
  metros
}

// ============================================================
// MÓDULO: PRECIOS POR VOLUMEN DEL DISTRIBUIDOR (RF-015, RF-016, RF-017)
// ============================================================

Table precio_volumen {
  id integer [pk, increment]
  producto_id integer [ref: > producto.id, not null]
  cantidad_minima decimal [not null, note: 'A partir de cuántas unidades rige este precio. Unidades enteras (Empaquetado) o unidad de visualización (Fraccionable). No puede ser cero ni negativa (RF-015).']
  precio_venta decimal [not null, note: 'Precio de venta por unidad. No puede ser cero ni negativo (RF-015).']
  precio_costo decimal [note: 'Puede no estar registrado (RF-040 contempla rentabilidad ausente); si está presente, no puede ser negativo.']

  Note: 'No es una relación muchos a muchos: cada precio por volumen pertenece a un único producto, y un producto tiene varios precios por volumen (1:N real). Se modela como entidad propia, no como tabla de unión, porque no conecta dos entidades distintas.'
}

// ============================================================
// MÓDULO: PEDIDOS (RF-007, RF-008, RF-024 a RF-030, RF-055 a RF-057)
// ============================================================

Table pedido {
  id integer [pk, increment]
  comprador_id integer [ref: > usuario.id, not null]
  distribuidor_id integer [ref: > distribuidor.id, not null, note: 'Cada sub-pedido pertenece a un único distribuidor; el carrito multiproveedor de RF-007 se divide en un pedido por distribuidor al confirmar (RF-008).']
  direccion_entrega varchar [not null, note: 'Se ingresa en el momento de confirmar el pedido (RF-008); no se guarda como entidad reutilizable del comprador (confirmado).']
  estado pedido_estado [not null, default: 'pendiente']
  motivo_rechazo varchar [note: 'Obligatorio únicamente cuando estado = rechazado (RF-026). Texto libre si el rechazo ocurrió en estado "en_camino"; selección de lista predefinida si ocurrió en estado "pendiente" — ambos casos se almacenan como texto libre porque el resultado final es una cadena de texto en ambos flujos.']
  fecha_creacion timestamp [not null, default: `now()`]
  fecha_entregado timestamp [note: 'Momento exacto en que el pedido pasó a estado "entregado" (RF-030). Nula mientras el pedido no llegue a ese estado. Necesaria porque RF-039 y RF-041 filtran "total facturado" y "cantidad de pedidos entregados" por período (día/semana/mes), y ese filtro debe usar la fecha del evento de negocio relevante (la entrega), no fecha_creacion — un pedido creado en un período y entregado en otro debe contar en el período de su entrega.']

  Note: 'Representa el sub-pedido por distribuidor (RF-008). No existe una entidad "carrito" persistente porque ningún RF exige conservar el carrito como historial: RF-007 lo describe como estado transitorio de sesión que se vacía al confirmar.'
}

Enum pedido_estado {
  pendiente
  aceptado
  en_camino
  entregado
  rechazado
}

Table pedido_item {
  id integer [pk, increment]
  pedido_id integer [ref: > pedido.id, not null]
  producto_id integer [ref: > producto.id, not null]
  precio_volumen_id integer [ref: > precio_volumen.id, not null, note: 'Referencia al rango de precio por volumen que se aplicó al confirmar (RF-008). Necesaria para que RF-017 pueda validar "no eliminar un precio por volumen con pedidos Pendiente/Aceptado que lo referencian": sin esta columna no hay forma de saber qué precio_volumen específico originó cada pedido_item, solo qué producto.']
  cantidad decimal [not null, note: 'En la unidad del producto (entera para Empaquetado, decimal para Fraccionable).']
  precio_venta_congelado decimal [not null, note: 'Copia del precio_venta de precio_volumen vigente al momento de confirmar el pedido. Se almacena de forma independiente porque RF-016 exige que los pedidos Pendiente/Aceptado conserven el precio aunque el distribuidor lo edite después: leerlo "en vivo" desde precio_volumen violaría ese requerimiento.']

  Note: 'Tabla de unión obligatoria entre pedido y producto: tiene atributos propios (cantidad, precio congelado, referencia al precio_volumen de origen) que no pertenecen ni a pedido ni a producto por separado, conforme al Paso 4 de la guía de modelado.'
}

Table propuesta_sustitucion {
  id integer [pk, increment]
  pedido_item_id integer [ref: > pedido_item.id, not null, note: 'El artículo original del pedido que se propone sustituir (RF-027).']
  producto_sustituto_id integer [ref: > producto.id, not null, note: 'Debe pertenecer al catálogo del mismo distribuidor del pedido (RF-027); esta regla de negocio se valida en la aplicación, no se puede expresar como restricción estructural del esquema.']
  estado propuesta_sustitucion_estado [not null, default: 'pendiente']
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Entidad propia porque tiene su propio ciclo de vida (RF-027, RF-028) independiente del pedido_item que referencia. Al aceptar una propuesta, el pedido_item original NO se modifica: pedido_item.producto_id conserva siempre el producto original (confirmado). Regla de lectura para RF-032/RF-056/RF-057 (confirmado): para cada pedido_item, buscar su propuesta_sustitucion más reciente; si existe una con estado="aceptada", mostrar producto_sustituto_id; en cualquier otro caso (no existe propuesta, o existe pero está "pendiente" o "rechazada"), mostrar pedido_item.producto_id. La condición depende del ESTADO de la propuesta, no solo de su existencia.'
}

Enum propuesta_sustitucion_estado {
  pendiente
  aceptada
  rechazada
}

// ============================================================
// MÓDULO: NOTIFICACIONES (RF-022, RF-024, RF-029, RF-060)
// ============================================================

Table notificacion {
  id integer [pk, increment]
  usuario_id integer [ref: > usuario.id, not null, note: 'Tabla genérica para comprador y distribuidor (confirmado): el destinatario siempre es una cuenta de usuario, sin importar en qué modo la recibe.']
  pedido_id integer [ref: > pedido.id, note: 'Nula cuando la notificación no refiere a un pedido (por ejemplo, alerta de stock bajo de RF-022).']
  tipo notificacion_tipo [not null]
  mensaje varchar [not null, note: 'Contenido visible: incluye número de pedido, nuevo estado, motivo de rechazo si aplica (RF-029), o nombre del producto afectado (RF-022).']
  leida boolean [not null, default: false]
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Una sola tabla sirve tanto para notificaciones al comprador (RF-029, RF-060) como al distribuidor (RF-024, RF-022), porque ambas comparten exactamente la misma estructura (destinatario, mensaje, estado de lectura) y el destinatario en ambos casos es una fila de usuario.'
}

Enum notificacion_tipo {
  cambio_estado_pedido
  pedido_entrante
  stock_bajo
}

// ============================================================
// MÓDULO: CALIFICACIONES (RF-033, RF-004)
// ============================================================

Table calificacion {
  id integer [pk, increment]
  pedido_id integer [ref: - pedido.id, not null, unique, note: 'Relación uno a uno: cada pedido entregado habilita exactamente una calificación (RF-033: "una sola calificación por parte del comprador"), y una calificación corresponde a un único pedido.']
  distribuidor_id integer [ref: > distribuidor.id, not null, note: 'Redundante con pedido.distribuidor_id en términos de navegación, pero necesaria para calcular el promedio del distribuidor (RF-004) sin atravesar pedido en cada consulta agregada; se justifica como desnormalización intencional de lectura, no como duplicación accidental.']
  valor integer [not null, note: 'Calificación numérica enviada por el comprador. No puede modificarse una vez enviada (RF-033).']
  fecha_creacion timestamp [not null, default: `now()`]
}

// ============================================================
// MÓDULO: PROVEEDORES (RF-034, RF-035, RF-036, RF-037, RF-038)
// ============================================================

Table proveedor {
  id integer [pk, increment]
  distribuidor_id integer [ref: > distribuidor.id, not null, note: 'Cada proveedor pertenece a un distribuidor específico, no es una entidad compartida del sistema (RF-034).']
  nombre varchar [not null]
  telefono_whatsapp varchar [not null]
}

Table precio_volumen_proveedor {
  id integer [pk, increment]
  proveedor_id integer [ref: > proveedor.id, not null]
  producto_id integer [ref: > producto.id, not null, note: 'Debe pertenecer al catálogo del mismo distribuidor que registra el precio (RF-038); regla de negocio validada en aplicación.']
  cantidad_minima decimal [not null, note: 'No puede ser cero ni negativa (RF-038).']
  precio_costo decimal [not null, note: 'No puede ser negativo (RF-038).']

  Note: 'Tabla de unión obligatoria entre proveedor y producto: tiene atributos propios (cantidad mínima, precio de costo) que no pertenecen a ninguna de las dos entidades por separado (RF-038).'
}

Table pedido_reposicion {
  id integer [pk, increment]
  distribuidor_id integer [ref: > distribuidor.id, not null]
  proveedor_id integer [ref: > proveedor.id, not null]
  estado pedido_reposicion_estado [not null, default: 'borrador']
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Pedido de compra del distribuidor hacia su proveedor (RF-036, RF-037), distinto del pedido de venta al comprador.'
}

Enum pedido_reposicion_estado {
  borrador
  confirmado
}

Table pedido_reposicion_item {
  id integer [pk, increment]
  pedido_reposicion_id integer [ref: > pedido_reposicion.id, not null]
  producto_id integer [ref: > producto.id, not null]
  cantidad decimal [not null, note: 'No puede ser cero ni negativa (RF-036).']

  Note: 'Tabla de unión obligatoria entre pedido_reposicion y producto: tiene el atributo propio cantidad (RF-036).'
}

// ============================================================
// MÓDULO: PLANIFICACIÓN DE REPARTO (RF-047 a RF-050)
// ============================================================

Table plan_reparto {
  id integer [pk, increment]
  distribuidor_id integer [ref: > distribuidor.id, not null]
  estado plan_reparto_estado [not null, default: 'activo']
  fecha_creacion timestamp [not null, default: `now()`]

  Note: 'Agrupa los pedidos seleccionados para una ronda de reparto (RF-047, RF-048). El orden resultante del cálculo de distancia se almacena en parada_reparto.orden, no en esta tabla, porque el orden es un atributo de cada parada, no del plan completo.'
}

Enum plan_reparto_estado {
  activo
  finalizado
}

Table parada_reparto {
  id integer [pk, increment]
  plan_reparto_id integer [ref: > plan_reparto.id, not null]
  pedido_id integer [ref: > pedido.id, not null, unique, note: 'Único: un pedido aparece como máximo en una parada activa, ya que RF-047 exige que el pedido esté en estado Aceptado al seleccionarse.']
  orden integer [not null, note: 'Posición en la secuencia de entrega calculada por el modelo de IA externo (RF-048). El MER almacena únicamente el resultado del cálculo, no el proceso (confirmado).']
  estado_parada parada_reparto_estado [not null, default: 'pendiente']
  motivo_rechazo varchar [note: 'Obligatorio únicamente cuando estado_parada = rechazado (RF-050).']

  Note: 'Tabla de unión obligatoria entre plan_reparto y pedido: tiene atributos propios (orden, estado de la parada) que no pertenecen a ninguna de las dos entidades por separado (RF-049, RF-050).'
}

Enum parada_reparto_estado {
  pendiente
  entregado
  omitido
  rechazado
}

// ============================================================
// AGRUPACIÓN VISUAL
// ============================================================

TableGroup cuenta_y_acceso {
  usuario
  codigo_verificacion
  empleado
  codigo_verificacion_empleado
}

TableGroup catalogo {
  categoria
  producto
  precio_volumen
}

TableGroup ventas {
  pedido
  pedido_item
  propuesta_sustitucion
  calificacion
}

TableGroup compras_a_proveedor {
  proveedor
  precio_volumen_proveedor
  pedido_reposicion
  pedido_reposicion_item
}

TableGroup reparto {
  plan_reparto
  parada_reparto
}
```
