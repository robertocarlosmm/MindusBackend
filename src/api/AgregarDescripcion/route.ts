import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ProductoExtensionModuleService from "../../modules/productoExtension/service";
import { PROUCTOEXTENSION_MODULE } from "../../modules/productoExtension";
import { z } from "zod";
import { ProductoExtensionSchema } from "./validators";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

type ProductoExtensionType = z.infer<typeof ProductoExtensionSchema>

export async function POST(
    req: MedusaRequest<ProductoExtensionType>,
    res: MedusaResponse
) {
    const data = req.validatedBody;
    const productoExtensionModuleService: ProductoExtensionModuleService = req.scope.resolve(PROUCTOEXTENSION_MODULE)

    if (data.idProductoExtension) {
        console.log("Actualizando producto extension con id:", data.idProductoExtension)
        const productoExtension = await productoExtensionModuleService.updateProductoExtensions(
            { id: data.idProductoExtension, descripcionTecnica: data.descripcionTecnica }
        )

        res.json({ productoExtension })
    } else {
        const productoExtension = await productoExtensionModuleService.createProductoExtensions(
            { descripcionTecnica: req.validatedBody.descripcionTecnica }
        )
        //console.log(req.validatedBody)

        const linkService = req.scope.resolve(ContainerRegistrationKeys.LINK) // ← actualizado
        //Links:
        await linkService.create({
            [Modules.PRODUCT]: { product_id: req.validatedBody.idProducto },
            [PROUCTOEXTENSION_MODULE]: { producto_extension_id: productoExtension.id },
        })

        res.json({ productoExtension })
    }



}