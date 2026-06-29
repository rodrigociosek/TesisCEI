# Diagrama de Código — Marketplace Mayorista (Mermaid)

Diagrama de clases derivado del MER, formalizado para generación de código real: incluye enumerados (UPPER_SNAKE_CASE), DTOs, clases de dominio con sus atributos y métodos, y las relaciones de negocio y de dependencia entre ellas.

```mermaid
classDiagram
    %% ============================================================
    %% ENUMERADOS (formalizados para generación de código real)
    %% Origen: extraídos directamente de los 12 Enum del DBML.
    %% Convención de valores: UPPER_SNAKE_CASE (ver decision_nomenclatura_enums.md)
    %% ============================================================
    class PropositoCodigo {
        <<enumeration>>
        ACTIVACION_CUENTA
        RECUPERACION_PASSWORD
    }

    class RolEmpleado {
        <<enumeration>>
        ADMINISTRADOR
        OPERADOR
    }

    class TipoProducto {
        <<enumeration>>
        EMPAQUETADO
        FRACCIONABLE
    }

    class EstadoVisibilidad {
        <<enumeration>>
        PUBLICADO
        PAUSADO
    }

    class UnidadBase {
        <<enumeration>>
        GRAMO
        MILILITRO
        CENTIMETRO
    }

    class MetricaVisualizacion {
        <<enumeration>>
        KILOGRAMOS
        LITROS
        METROS
    }

    class EstadoPedido {
        <<enumeration>>
        PENDIENTE
        ACEPTADO
        EN_CAMINO
        ENTREGADO
        RECHAZADO
    }

    class EstadoPropuesta {
        <<enumeration>>
        PENDIENTE
        ACEPTADA
        RECHAZADA
    }

    class TipoNotificacion {
        <<enumeration>>
        CAMBIO_ESTADO_PEDIDO
        PEDIDO_ENTRANTE
        STOCK_BAJO
    }

    class EstadoPedidoReposicion {
        <<enumeration>>
        BORRADOR
        CONFIRMADO
    }

    class EstadoPlanReparto {
        <<enumeration>>
        ACTIVO
        FINALIZADO
    }

    class EstadoParada {
        <<enumeration>>
        PENDIENTE
        ENTREGADO
        OMITIDO
        RECHAZADO
    }

    %% ============================================================
    %% ENUMERADOS adicionales (no provienen de una columna del MER,
    %% sino de un valor de selección fijo descrito textualmente en
    %% un CU/RF — ver verificación de trazabilidad en este mismo
    %% reporte antes de aceptarlos)
    %% ============================================================
    class MotivoRechazoPredefinido {
        <<enumeration>>
        SIN_STOCK_PRODUCTO
        PRODUCTO_DISCONTINUADO
        FUERA_DE_ZONA_ENTREGA
        ERROR_EN_DATOS_PEDIDO
        DISTRIBUIDORA_NO_DISPONIBLE
    }

    class PeriodoReporte {
        <<enumeration>>
        DIA_ACTUAL
        SEMANA_ACTUAL
        MES_ACTUAL
    }

    class TipoExportacion {
        <<enumeration>>
        PEDIDOS
        PRODUCTOS
        STOCK
    }

    %% ============================================================
    %% ESTRUCTURAS DE TRANSFERENCIA DE DATOS (DTO)
    %% No son clases de dominio con identidad ni persistencia propia
    %% (sección 1.1 de la guía de construcción); formalizadas aquí
    %% porque un tipo de retorno "List" sin estructura no compila.
    %% Cada campo cita su origen textual exacto del CU correspondiente.
    %% ============================================================
    class ReporteRendimientoDTO {
        <<DTO>>
        -periodo: PeriodoReporte
        -totalFacturado: Decimal
        -cantidadPedidosEntregados: Integer
        -productosMasVendidos: List~Producto~
        -productosMenosVendidos: List~Producto~
    }

    class RentabilidadDTO {
        <<DTO>>
        -precioVolumen: PrecioVolumen
        -diferenciaPesos: Decimal
        -diferenciaPorcentaje: Decimal
        +/tienePrecioCostoRegistrado: Boolean
    }

    class ResultadoEliminacion {
        <<DTO>>
        -tipoResultado: TipoResultadoEliminacion
        -mensaje: String
    }

    class TipoResultadoEliminacion {
        <<enumeration>>
        ELIMINADO_FISICAMENTE
        DESHABILITADO
    }

    %% ============================================================
    %% MÓDULO: CUENTA Y ACCESO
    %% ============================================================
    class Usuario {
        -id: Integer
        -nombreCompleto: String
        -telefono: String
        -contrasenaHash: String
        -modoDistribuidorActivo: Boolean
        -cuentaVerificada: Boolean
        -consentimientoDatosOtorgado: Boolean
        -fechaCreacion: DateTime
        +registrarCuenta(nombreCompleto: String, telefono: String, contrasena: String, consentimiento: Boolean): Usuario
        +verificarCodigoActivacion(codigo: String): Boolean
        +iniciarSesion(telefono: String, contrasena: String): Boolean
        +solicitarRecuperacionContrasena(telefono: String): void
        +restablecerContrasena(codigo: String, nuevaContrasena: String): Boolean
        +activarModoDistribuidor(): Distribuidor
        +cambiarModoActivo(): void
        +cerrarSesion(): void
    }

    class CodigoVerificacion {
        -id: Integer
        -codigo: String
        -proposito: PropositoCodigo
        -fechaExpiracion: DateTime
        -usado: Boolean
        -fechaCreacion: DateTime
        +haVencido(): Boolean
        +marcarComoUsado(): void
    }

    class Empleado {
        -id: Integer
        -nombreCompleto: String
        -cedulaIdentidad: String
        -telefono: String
        -rol: RolEmpleado
        -contrasenaHash: String
        -debeCambiarContrasena: Boolean
        -cuentaActiva: Boolean
        -fechaCreacion: DateTime
        +iniciarSesion(cedula: String, contrasena: String): Boolean
        +cambiarContrasenaPrimerAcceso(nuevaContrasena: String): Boolean
        +solicitarRecuperacionContrasena(cedula: String): void
        +restablecerContrasena(codigo: String, nuevaContrasena: String): Boolean
        +desactivarCuenta(): void
        +reactivarCuenta(): void
    }

    class CodigoVerificacionEmpleado {
        -id: Integer
        -codigo: String
        -fechaExpiracion: DateTime
        -usado: Boolean
        -fechaCreacion: DateTime
        +haVencido(): Boolean
        +marcarComoUsado(): void
    }

    %% ============================================================
    %% MÓDULO: PERFIL DEL DISTRIBUIDOR
    %% ============================================================
    class Distribuidor {
        -id: Integer
        -nombreComercial: String
        -descripcionNegocio: String
        -zonaEntrega: String
        -direccionPartida: String
        -perfilConfigurado: Boolean
        -fechaCreacion: DateTime
        +/calificacionPromedio: Decimal
        +configurarPerfilInicial(nombreComercial: String, descripcion: String, zonaEntrega: String): Boolean
        +editarPerfil(nombreComercial: String, descripcion: String, zonaEntrega: String): Boolean
        +registrarDireccionPartida(direccion: String): Boolean
        +obtenerCalificacionPromedio(): Decimal
        +tieneCalificaciones(): Boolean
        +crearProducto(nombre: String, descripcion: String, imagenUrl: String, categoria: Categoria, tipo: TipoProducto, stockInicial: Integer, cantidadMinimaCompra: Decimal, descripcionUnidadVenta: String, unidadBaseInterna: UnidadBase, incrementoVenta: Decimal, metricaVisualizacion: MetricaVisualizacion): Producto
        +crearEmpleado(nombreCompleto: String, cedula: String, telefono: String, rol: RolEmpleado): Empleado
        +gestionarListaEmpleados(): List~Empleado~
    }

    %% ============================================================
    %% MÓDULO: REPORTES (extraído de Distribuidor)
    %% ============================================================
    class ServicioReportes {
        +generarReporteRendimiento(distribuidor: Distribuidor, periodo: PeriodoReporte): ReporteRendimientoDTO
        +calcularRentabilidadPorPrecioVolumen(distribuidor: Distribuidor): List~RentabilidadDTO~
        +exportarDatos(distribuidor: Distribuidor, conjuntos: List~TipoExportacion~): Archivo
    }

    %% ============================================================
    %% MÓDULO: CATEGORÍAS Y PRODUCTOS
    %% ============================================================
    class Categoria {
        -id: Integer
        -nombre: String
    }

    class Producto {
        -id: Integer
        -nombre: String
        -descripcion: String
        -imagenUrl: String
        -tipoProducto: TipoProducto
        -estadoVisibilidad: EstadoVisibilidad
        -habilitado: Boolean
        -descripcionUnidadVenta: String
        -cantidadMinimaCompra: Decimal
        -unidadBaseInterna: UnidadBase
        -incrementoVenta: Decimal
        -metricaVisualizacion: MetricaVisualizacion
        -stockTotal: Integer
        -stockReservado: Integer
        -umbralMinimoStock: Integer
        -fechaCreacion: DateTime
        +/stockDisponible: Integer
        +validarDatosCreacion(nombre: String, tipo: TipoProducto, stockInicial: Integer, cantidadMinima: Decimal, incrementoVenta: Decimal): Boolean
        +editar(nombre: String, descripcion: String, imagenUrl: String, categoria: Categoria, cantidadMinimaCompra: Decimal, descripcionUnidadVenta: String, incrementoVenta: Decimal, metricaVisualizacion: MetricaVisualizacion, stockTotal: Integer): Boolean
        +eliminarOdeshabilitar(): ResultadoEliminacion
        +obtenerStockDisponible(): Integer
        +convertirAUnidadVisualizacion(cantidadEnUnidadBase: Decimal): Decimal
        +configurarUmbralMinimo(valor: Integer): Boolean
        +validarCantidadPedido(cantidad: Decimal): Boolean
        +obtenerPrecioVolumenAplicable(cantidad: Decimal): PrecioVolumen
        +cambiarVisibilidad(nuevoEstado: EstadoVisibilidad): Boolean
        +tieneRegistrosAsociados(): Boolean
        +tienePedidosRegistrados(): Boolean
    }

    %% ============================================================
    %% MÓDULO: PRECIOS POR VOLUMEN
    %% ============================================================
    class PrecioVolumen {
        -id: Integer
        -cantidadMinima: Decimal
        -precioVenta: Decimal
        -precioCosto: Decimal
        +validarDatos(precioVenta: Decimal, precioCosto: Decimal, cantidadMinima: Decimal): Boolean
        +puedeEliminarse(): Boolean
        +calcularRentabilidad(): RentabilidadDTO
    }

    %% ============================================================
    %% MÓDULO: PEDIDOS
    %% ============================================================
    class Pedido {
        -id: Integer
        -direccionEntrega: String
        -estado: EstadoPedido
        -motivoRechazo: String
        -fechaCreacion: DateTime
        -fechaEntregado: DateTime
        +confirmarDesdeCarrito(carrito: Carrito, direccionEntrega: String): List~Pedido~
        +aceptar(): Boolean
        +rechazar(motivo: String): Boolean
        +avanzarEstado(): Boolean
        +proponerSustituto(pedidoItem: PedidoItem, productoSustituto: Producto): PropuestaSustitucion
        +construirTextoWhatsapp(): String
        +obtenerProductoVigente(pedidoItem: PedidoItem): Producto
        +notificarCambioEstado(): void
    }

    class PedidoItem {
        -id: Integer
        -cantidad: Decimal
        -precioVentaCongelado: Decimal
        +congelarPrecio(precioVolumen: PrecioVolumen): void
    }

    class PropuestaSustitucion {
        -id: Integer
        -estado: EstadoPropuesta
        -fechaCreacion: DateTime
        +aceptar(): void
        +rechazar(): void
        +estaPendiente(): Boolean
    }

    %% ============================================================
    %% MÓDULO: NOTIFICACIONES
    %% ============================================================
    class Notificacion {
        -id: Integer
        -tipo: TipoNotificacion
        -mensaje: String
        -leida: Boolean
        -fechaCreacion: DateTime
        +marcarComoLeida(): void
        +generarMensaje(tipo: TipoNotificacion, datos: Map): String
    }

    %% ============================================================
    %% MÓDULO: CALIFICACIONES
    %% ============================================================
    class Calificacion {
        -id: Integer
        -valor: Integer
        -fechaCreacion: DateTime
        +registrar(pedido: Pedido, valor: Integer): Boolean
    }

    %% ============================================================
    %% MÓDULO: PROVEEDORES
    %% ============================================================
    class Proveedor {
        -id: Integer
        -nombre: String
        -telefonoWhatsapp: String
        +validarDatos(nombre: String, telefono: String): Boolean
    }

    class PrecioVolumenProveedor {
        -id: Integer
        -cantidadMinima: Decimal
        -precioCosto: Decimal
        +validarDatos(cantidadMinima: Decimal, precioCosto: Decimal): Boolean
        +perteneceAlMismoDistribuidor(producto: Producto, distribuidor: Distribuidor): Boolean
    }

    class PedidoReposicion {
        -id: Integer
        -estado: EstadoPedidoReposicion
        -fechaCreacion: DateTime
        +agregarItem(producto: Producto, cantidad: Decimal): PedidoReposicionItem
        +construirTextoWhatsapp(): String
    }

    class PedidoReposicionItem {
        -id: Integer
        -cantidad: Decimal
    }

    %% ============================================================
    %% SERVICIO COMPARTIDO DE INTEGRACIÓN EXTERNA
    %% ============================================================
    class GeneradorEnlaceWhatsapp {
        +construirDeepLink(telefono: String, mensaje: String): String
    }

    %% ============================================================
    %% MÓDULO: PLANIFICACIÓN DE REPARTO
    %% ============================================================
    class PlanReparto {
        -id: Integer
        -estado: EstadoPlanReparto
        -fechaCreacion: DateTime
        +generarPlanCarga(pedidosSeleccionados: List~Pedido~, direccionPartida: String): List~ParadaReparto~
        +finalizar(): void
    }

    class ParadaReparto {
        -id: Integer
        -orden: Integer
        -estadoParada: EstadoParada
        -motivoRechazo: String
        +marcarEntregado(): Boolean
        +marcarOmitido(): void
        +marcarRechazado(): Boolean
        +generarEnlaceGoogleMaps(): String
    }

    %% ============================================================
    %% CLASES NO PERSISTENTES (estado transitorio de sesión)
    %% ============================================================
    class Carrito {
        -items: List~ItemCarrito~
        +agregarProducto(producto: Producto, cantidad: Decimal): Boolean
        +modificarCantidad(item: ItemCarrito, nuevaCantidad: Decimal): Boolean
        +eliminarProducto(item: ItemCarrito): void
        +calcularSubtotalPorDistribuidor(distribuidor: Distribuidor): Decimal
        +vaciar(): void
    }

    class ItemCarrito {
        -cantidad: Decimal
        -precioEstimado: Decimal
        +recalcularPrecioEstimado(): Decimal
    }

    %% ============================================================
    %% RELACIONES DE NEGOCIO (idénticas a la versión probada y corregida)
    %% ============================================================
    Usuario "1" -- "0..1" Distribuidor : activa
    Distribuidor "1" *-- "0..*" Empleado : emplea
    Empleado "1" *-- "0..*" CodigoVerificacionEmpleado : genera
    Usuario "1" *-- "0..*" CodigoVerificacion : genera
    Distribuidor "1" -- "0..*" Producto : publica
    Categoria "1" -- "0..*" Producto : clasifica
    Producto "1" *-- "0..*" PrecioVolumen : ofrece
    Usuario "1" -- "0..*" Pedido : compra
    Distribuidor "1" -- "0..*" Pedido : recibe
    Pedido "1" -- "1..*" PedidoItem : contiene
    Producto "1" -- "0..*" PedidoItem : referencia
    PrecioVolumen "1" -- "0..*" PedidoItem : aplica
    PedidoItem "1" -- "0..*" PropuestaSustitucion : recibe
    Producto "1" -- "0..*" PropuestaSustitucion : sustituye
    Usuario "1" *-- "0..*" Notificacion : recibe
    Pedido "0..1" -- "0..*" Notificacion : origina
    Pedido "1" *-- "0..1" Calificacion : habilita
    Distribuidor "1" -- "0..*" Calificacion : recibe
    Distribuidor "1" *-- "0..*" Proveedor : registra
    Proveedor "1" -- "0..*" PrecioVolumenProveedor : cotiza
    Producto "1" -- "0..*" PrecioVolumenProveedor : referencia
    Distribuidor "1" -- "0..*" PedidoReposicion : genera
    Proveedor "1" -- "0..*" PedidoReposicion : recibe
    PedidoReposicion "1" -- "1..*" PedidoReposicionItem : contiene
    Producto "1" -- "0..*" PedidoReposicionItem : referencia
    Distribuidor "1" *-- "0..*" PlanReparto : organiza
    PlanReparto "1" -- "1..*" ParadaReparto : contiene
    Pedido "1" -- "0..1" ParadaReparto : agenda
    Usuario "1" -- "0..1" Carrito : posee
    Carrito "1" *-- "0..*" ItemCarrito : contiene
    Producto "1" -- "0..*" ItemCarrito : referencia

    %% ============================================================
    %% DEPENDENCIAS DE SERVICIO (línea punteada — uso temporal)
    %% ============================================================
    Distribuidor ..> ServicioReportes : usa
    Pedido ..> GeneradorEnlaceWhatsapp : usa
    PedidoReposicion ..> GeneradorEnlaceWhatsapp : usa

    %% ============================================================
    %% DEPENDENCIAS DE TIPO (línea punteada — la clase usa el enum/DTO
    %% como tipo de un atributo o de una firma de método, sin
    %% mantener una referencia estructural permanente de objeto a
    %% objeto; ver sección 2.3 de la guía de construcción sobre
    %% dependencia: "una clase usa a otra temporalmente... sin
    %% guardar una referencia permanente")
    %% ============================================================
    CodigoVerificacion ..> PropositoCodigo : usa
    Empleado ..> RolEmpleado : usa
    Producto ..> TipoProducto : usa
    Producto ..> EstadoVisibilidad : usa
    Producto ..> UnidadBase : usa
    Producto ..> MetricaVisualizacion : usa
    Pedido ..> EstadoPedido : usa
    PropuestaSustitucion ..> EstadoPropuesta : usa
    Notificacion ..> TipoNotificacion : usa
    PedidoReposicion ..> EstadoPedidoReposicion : usa
    PlanReparto ..> EstadoPlanReparto : usa
    ParadaReparto ..> EstadoParada : usa
    ServicioReportes ..> PeriodoReporte : usa
    ServicioReportes ..> ReporteRendimientoDTO : produce
    ServicioReportes ..> RentabilidadDTO : produce
    ServicioReportes ..> TipoExportacion : usa
    PrecioVolumen ..> RentabilidadDTO : produce
    RentabilidadDTO ..> PrecioVolumen : referencia
    ReporteRendimientoDTO ..> PeriodoReporte : usa
    ReporteRendimientoDTO ..> Producto : referencia
    Producto ..> ResultadoEliminacion : produce
    ResultadoEliminacion ..> TipoResultadoEliminacion : usa
```
