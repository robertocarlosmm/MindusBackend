import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type {
    IProductModuleService
} from "@medusajs/framework/types"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * POST /admin/store/:id/product
 * Crea un producto y lo enlaza a la tienda indicada por :id (store_id)
 */

/*export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { result } = await createProductsWorkflow(req.scope).run({
        input: { products: [req.body] }
    })
    res.json({ product: result[0] })
}*/
/*

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        // 1️⃣ Obtén el store_id del path parameter
        const storeId: string = req.params.id
        // 2️⃣ Datos del nuevo producto desde el body
        const productData = req.body

        // 4️⃣ Crea el producto

        const remotelinkService = req.scope.resolve(ContainerRegistrationKeys.LINK) // ← actualizado

        const { result } = await createProductsWorkflow(req.scope).run({
            input: { products: [productData] }
        })


        // 5️⃣ Enlaza el producto a la store usando remoteLink
        await remotelinkService.create({
            [Modules.PRODUCT]: { store_id: product.id },
            [Modules.STORE]: { store_id: storeId },
        })

        // 6️⃣ Devuelve el producto creado
        res.status(201).json({ product })
    } catch (err) {
        console.error("Error creando producto con link a store:", err)
        res.status(500).json({ error: err.message || err })
    }
}
*/