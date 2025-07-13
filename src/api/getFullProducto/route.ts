// src/api/custom/product-with-extension/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import productoExtension from "../../modules/productoExtension"

export const POST = async (req: MedusaRequest<{ idProducto: string }>, res: MedusaResponse) => {
    const { idProducto } = req.body

    // 1️⃣ Resuelvo el Query service
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // 2️⃣ Traigo el producto (todos sus campos)
    const {
        data: [product]
    } = await query.graph({
        entity: "product",
        filters: { id: idProducto },
        fields: ["*", "producto_extension.id", "producto_extension.descripcionTecnica"],   // “*” = todos los campos de product
    })

    if (!product) {
        return res.status(404).json({ error: "Product not found" })
    }

    //  Crear los campos con null si no vienen
    const idProductoExtension = product.producto_extension?.id ?? null
    const descripcionTecnica = product.producto_extension?.descripcionTecnica ?? null

    // 3️⃣ Destructura para “quitar” producto_extension
    const { producto_extension, ...baseProduct } = product

    // 4️⃣ Devuelve todo aplanado + tus dos campos
    return res.json({
        ...baseProduct,
        idProductoExtension,
        descripcionTecnica,
    })

}
