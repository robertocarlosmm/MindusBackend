// src/api/admin/empresa/bulk-create/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { File as MulterFile } from "multer"
import csv from "csv-parser"
import { Readable } from "stream"

import EmpresaModuleService from "../../../modules/empresa/service"
import { EMPRESA_MODULE } from "../../../modules/empresa"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

import type {
    IStoreModuleService,
    IAuthModuleService,
    IProductModuleService,
    AuthenticationInput,
} from "@medusajs/framework/types"
import { title } from "process"

// 1️⃣ Extendemos el Request para incluir `file.buffer`
type MulterRequest = MedusaRequest & {
    file?: MulterFile & { buffer: Buffer }
}

export async function POST(req: MulterRequest, res: MedusaResponse) {
    // 2️⃣ Aseguramos que Multer haya cargado el CSV en memoria
    if (!req.file?.buffer) {
        return res.status(400).json({ message: "No se recibió ningún CSV" })
    }

    // 3️⃣ Resolución única de services
    const empresaService = req.scope.resolve<EmpresaModuleService>(EMPRESA_MODULE)
    const storeService = req.scope.resolve<IStoreModuleService>(Modules.STORE)
    const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
    const linkService = req.scope.resolve(ContainerRegistrationKeys.LINK) // ← actualizado

    const resultados: Array<{ row: number; ok: boolean; error?: string }> = []
    let rowNum = 0

    // 4️⃣ Leemos en streaming el buffer y parseamos CSV
    const parser = Readable.from(req.file.buffer).pipe(
        csv({ mapHeaders: ({ header }) => header.trim() })
    )

    try {
        for await (const data of parser) {
            rowNum++

            // 5️⃣ Validación de campos obligatorios
            const faltan: string[] = [];
            ["RUC", "titulo", "descripcion corta"].forEach(k => {
                if (!data[k]?.trim()) faltan.push(k)
            });

            console.log(`Fila ${rowNum}:`, JSON.stringify(data, null, 2))

            if (faltan.length) {
                resultados.push({
                    row: rowNum,
                    ok: false,
                    error: `Faltan campos: ${faltan.join(", ")}`,
                })
                continue
            }

            // 6️⃣ Flujo: Bucar store desde empresa -> crear producto -> linkear producto a store
            try {
                // a) Buscar ID de store
                const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
                const { data: tiendas } = await query.graph({
                    entity: "empresa",
                    fields: ["store.id"], // retrieve empresa id and related store id
                    filters: { ruc: data["RUC"] },
                })
                if(tiendas[0].store != null) {
                    console.log("Tiendas encontradas:", tiendas[0].store.id)
                } else{
                    console.log("No se encontró tienda para el RUC:", data["RUC"])
                    continue;
                }
                //GET: empresas[0].store.id

                // b) Crear producto
                const parsedMetadata = data["metadata"]
                    ? JSON.parse(data["metadata"].replace(/""/g, `"`)) // convierte string CSV a JSON real
                    : {};
                const productoNuevo = {
                    title: data["titulo"],
                    subtitle: data["subtitulo"] || "",
                    description: data["descripcion corta"] || "",
                    images: data["Enlace fotos"] ? [data["Enlace fotos"]] : [],
                    weight: data["weight"] || null,
                    length: data["length"] || null,
                    height: data["height"] || null,
                    width: data["width"] || null,
                    metadata: parsedMetadata,
                }

                const { result } = await createProductsWorkflow(req.scope).run({
                    input: { products: [productoNuevo] },
                })
                
                console.log("Producto creado:", result[0])
                
                // e) Links: Product ↔ Store
                await linkService.create({
                    [Modules.PRODUCT]: { product_id: result[0].id },
                    [Modules.STORE]: { store_id: tiendas[0].store.id },
                })
                resultados.push({ row: rowNum, ok: true })
            } catch (err: any) {
                resultados.push({ row: rowNum, ok: false, error: err.message })
            }
        }

        // 7️⃣ Resumen final
        const successful = resultados.filter(r => r.ok).length
        const failed = resultados.length - successful

        return res.json({ total: resultados.length, successful, failed, details: resultados })
    } catch (err: any) {
        return res.status(500).json({ message: "Error leyendo CSV", error: err.message })
    }
}
