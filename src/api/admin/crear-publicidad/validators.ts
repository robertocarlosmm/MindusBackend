import { z } from "zod"

export const PublicidadSchema = z.object({
    fechaInicio: z.date(),
    fechaFin: z.date(),
    idProducto: z.string(),
    observacion: z.string().nullable().optional(),
})