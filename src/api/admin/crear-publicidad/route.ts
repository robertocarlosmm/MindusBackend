import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import PublicidadModuleService from "../../../modules/publicidad/service"
import { PUBLICIDAD_MODULE } from "../../../modules/publicidad"
import { z } from "zod"
import { PublicidadSchema } from "./validators"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

type PublicidadType = z.infer<typeof PublicidadSchema>

export async function POST(
    req: MedusaRequest<PublicidadType>,
    res: MedusaResponse
) {
    const publicidadModuleService: PublicidadModuleService = req.scope.resolve(PUBLICIDAD_MODULE)
    const publicidad = await publicidadModuleService.createPublicidads(req.validatedBody)
    console.log(req.validatedBody)

    const linkService = req.scope.resolve(ContainerRegistrationKeys.LINK) // ← actualizado
    await linkService.create({
        [Modules.PRODUCT]: { product_id: req.validatedBody.idProducto },
        [PUBLICIDAD_MODULE]: { publicidad_id: publicidad.id },
    })

    res.json({ publicidad })
}