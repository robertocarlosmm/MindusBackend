import { z } from "zod"

export const PublicidadSchema = z.object({
    fechaInicio: z.string().transform((val) => new Date(val)),
    fechaFin: z.string().transform((val) => new Date(val)),
    idProducto: z.string(),
    observacion: z.string().nullable().optional(),
})