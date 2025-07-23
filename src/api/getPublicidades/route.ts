import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import PublicidadModuleService from "../../modules/publicidad/service"
import { PUBLICIDAD_MODULE } from "../../modules/publicidad"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ProductPublicidadLink from "../../links/product-publicidad"


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const publicidadService = req.scope.resolve<PublicidadModuleService>(PUBLICIDAD_MODULE)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const now = new Date()

    const publicidades = await publicidadService.listPublicidads({
        fechaInicio: { $lte: now },
        fechaFin: { $gte: now },
    })
    //console.log("Publicidades activas:", publicidades)
    const publicidadIds = publicidades.map(p => p.id)


    const { data: links } = await query.graph({
        entity: ProductPublicidadLink.entryPoint,
        fields: ["product.*"],
        filters: {
            publicidad_id: publicidadIds, // Make sure this matches your link table's column name
        },
    })

    // Extract products from the link results
    const products = links.map(link => link.product)

    res.json({ products });
};
