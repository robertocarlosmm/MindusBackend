import { model } from "@medusajs/framework/utils"

const ProductoExtension = model.define("productoExtension", {
    id: model.id().primaryKey(),

    // Campos obligatorios
    codigoReferencia: model.text().nullable(),      // Código o referencia del producto
    descripcionTecnica: model.text().nullable(),      // Descripción técnica detallada
    fotosAltaCalidad: model.array().nullable(),     // Fotos de alta calidad desde varios ángulos
    unidadVenta: model.text().nullable(),      // Unidad de venta
    pesoVolumen: model.text().nullable(),      // Peso y volumen para cálculo de envío
    tiempoEstimadoEntrega: model.text().nullable(),      // Tiempo estimado de entrega
    disponibilidadStock: model.number().default(0),    // Disponibilidad/Stock
    politicasGarantiaDevoluciones: model.text().nullable(),      // Políticas de garantía y devoluciones

    // Campos opcionales
    imagenesContextoIndustrial: model.array().nullable(), // Imágenes de uso/instalación en contexto
    videosDemostrativos: model.array().nullable(), // Videos demostrativos (YouTube)
    condicionesAlmacenamientoTransporte: model.text().nullable(),  // Condiciones de almacenamiento y transporte
    descuentosPorVolumen: model.text().nullable(),  // Descuentos por volumen (si aplica)
    certificacionesIndustriales: model.array().nullable(), // Certificaciones industriales o de calidad
    manualesUsuarioMantenimiento: model.array().nullable(), // Manuales de usuario y de mantenimiento
    canalPostventaRepuestos: model.text().nullable(),  // Canal de postventa y repuestos
})

export default ProductoExtension
