import { z } from "zod"

export const ProductoExtensionSchema = z.object({
    // producto
    idProducto: z.string(),

    //validador de existencia del producto extension
    idProductoExtension: z.string().optional(),

    // Campos obligatorios (pero que admiten null)
    descripcionTecnica: z.string().nullable(),

    //logia adicional preventiva
    codigoReferencia: z.string().nullable().optional(),
    fotosAltaCalidad: z.array(z.string()).nullable().optional(),
    unidadVenta: z.string().nullable().optional(),
    pesoVolumen: z.string().nullable().optional(),
    tiempoEstimadoEntrega: z.string().nullable().optional(),
    disponibilidadStock: z.number().default(0).optional(),
    politicasGarantiaDevoluciones: z.string().nullable().optional(),

    // Campos opcionales
    imagenesContextoIndustrial: z.array(z.string()).nullable().optional(),
    videosDemostrativos: z.array(z.string()).nullable().optional(),
    condicionesAlmacenamientoTransporte: z.string().nullable().optional(),
    descuentosPorVolumen: z.string().nullable().optional(),
    certificacionesIndustriales: z.array(z.string()).nullable().optional(),
    manualesUsuarioMantenimiento: z.array(z.string()).nullable().optional(),
    canalPostventaRepuestos: z.string().nullable().optional(),
})

