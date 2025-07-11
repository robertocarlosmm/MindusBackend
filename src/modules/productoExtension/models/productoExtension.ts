import { model } from "@medusajs/framework/utils"

const ProductoExtension = model.define("productoExtension", {
    id: model.id().primaryKey(),

    // Campos obligatorios
    codigoReferencia: model.text(),      // Código o referencia del producto
    descripcionTecnica: model.text(),      // Descripción técnica detallada
    fotosAltaCalidad: model.array(),     // Fotos de alta calidad desde varios ángulos
    unidadVenta: model.text(),      // Unidad de venta
    pesoVolumen: model.text(),      // Peso y volumen para cálculo de envío
    tiempoEstimadoEntrega: model.text(),      // Tiempo estimado de entrega
    disponibilidadStock: model.number().default(0),    // Disponibilidad/Stock
    politicasGarantiaDevoluciones: model.text(),      // Políticas de garantía y devoluciones

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
