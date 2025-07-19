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
        fields: ["*", "producto_extension.id", "producto_extension.descripcionTecnica", "store.id", "store.name",
            "store.empresa.email", "store.empresa.telefono", "store.empresa.razonSocial", "store.empresa.logo",
            "store.empresa.website"
        ],
        // “*” = todos los campos de product
    })

    if (!product) {
        return res.status(404).json({ error: "Product not found" })
    }

    //  Crear los campos con null si no vienen
    const idProductoExtension = product.producto_extension?.id ?? null
    const descripcionTecnica = product.producto_extension?.descripcionTecnica ?? null
    // Campos simplificados de store
    const idStore = product.store?.id ?? null
    const nombreStore = product.store?.name ?? null
    //Campos de empresa
    const empresaEmail = product.store?.empresa?.email ?? null;
    const empresaTelefono = product.store?.empresa?.telefono ?? null;
    const empresaRazonSocial = product.store?.empresa?.razonSocial ?? null;
    const empresaLogo = product.store?.empresa?.logo ?? null;
    const empresaWebsite = product.store?.empresa?.website ?? null;
    // 3️⃣ Destructura para “quitar” producto_extension
    const { producto_extension, store, ...baseProduct } = product

    // 4️⃣ Devuelve todo aplanado + tus dos campos
    return res.json({
        ...baseProduct,
        idProductoExtension,
        descripcionTecnica,
        idStore,
        nombreStore,
        empresaEmail,
        empresaTelefono,
        empresaRazonSocial,
        empresaLogo,
        empresaWebsite
    })

}
