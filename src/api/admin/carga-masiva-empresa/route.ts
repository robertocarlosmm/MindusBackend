// src/api/admin/empresa/bulk-create/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { File as MulterFile } from "multer"
import csv from "csv-parser"
import { Readable } from "stream"

import EmpresaModuleService from "../../../modules/empresa/service"
import { EMPRESA_MODULE } from "../../../modules/empresa"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type {
    ISalesChannelModuleService,
    IStoreModuleService,
    IUserModuleService,
    IAuthModuleService,
    AuthenticationInput,
} from "@medusajs/framework/types"

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
    const salesChannelService = req.scope.resolve<ISalesChannelModuleService>(Modules.SALES_CHANNEL)
    const empresaService = req.scope.resolve<EmpresaModuleService>(EMPRESA_MODULE)
    const storeService = req.scope.resolve<IStoreModuleService>(Modules.STORE)
    const userService = req.scope.resolve<IUserModuleService>(Modules.USER)
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
                ["Tienda", "Nombre", "Apellido", "Email usuario", "Password"].forEach(k => {
                    if (!data[k]?.trim()) faltan.push(k)
                });
                ["RUC", "Razon social", "UbicacionEmpresa", "Telefono", "Email empresa"].forEach(k => {
                    if (!data[k]?.trim()) faltan.push(k)
                })

            console.log(`Fila ${rowNum}:`, JSON.stringify(data, null, 2))

            if (faltan.length) {
                resultados.push({
                    row: rowNum,
                    ok: false,
                    error: `Faltan campos: ${faltan.join(", ")}`,
                })
                continue
            }

            // 6️⃣ Creación secuencial: Empresa → Store → User → Links
            try {
                // a) Sales Channel
                const [channel] = await salesChannelService.listSalesChannels({}, { take: 1 })

                // b) Empresa
                const empresa = await empresaService.createEmpresas({
                    ruc: data["RUC"],
                    razonSocial: data["Razon social"],
                    descripcionBreve: data["Descripcion breve"] || undefined,
                    descripcionExtensa: data["Descripcion extensa"] || undefined,
                    logo: data["Logo"] || undefined,
                    cantidadTrabajadores: data["Cantidad trabajadores"]
                        ? Number(data["Cantidad trabajadores"])
                        : undefined,
                    categorias: data["Categorias"]?.split(";"),
                    redesSociales: data["Redes sociales"]?.split(";"),
                    ubicacion: data["UbicacionEmpresa"],
                    telefono: data["Telefono"],
                    email: data["Email empresa"],
                    canalesDeAtencion: data["Canales de atencion"]?.split(";"),
                    politicaDeGarantia: data["Politica garantia"] || undefined,
                    politicaDeDevolucion: data["Politica devolucion"] || undefined,
                    website: data["Website"] || undefined,
                    horarioAtencion: data["Horario atencion"] || undefined,
                    certificaciones: data["Certificaciones"]?.split(";"),
                    premios: data["Premios"]?.split(";"),
                    procesosProductivos: data["Procesos productivos"] || undefined,
                    procesosControlCalidad: data["Control calidad"] || undefined,
                    anhoFundacion: Number(data["Anho fundacion"]),
                    idiomas: data["Idiomas"]?.split(";"),
                    paisesAtencion: data["Paises atencion"]?.split(";"),
                })

                // c) Store
                const store = await storeService.createStores({
                    name: data["Tienda"],
                    default_sales_channel_id: channel.id,
                    supported_currencies: [{ currency_code: "usd", is_default: true }],
                })

                // d) User + Auth
                const user = await userService.createUsers({
                    first_name: data["Nombre"],
                    last_name: data["Apellido"],
                    email: data["Email usuario"],
                })
                const registerResp = await authService.register(
                    "emailpass",
                    { body: { email: data["Email usuario"], password: data["Password"] } } as AuthenticationInput
                )
                if (!registerResp.authIdentity) {
                    throw new Error("Falló la creación de la identidad de autenticación")
                }
                await authService.updateAuthIdentities({
                    id: registerResp.authIdentity.id,
                    app_metadata: { user_id: user.id },
                })

                // e) Links: User ↔ Store
                await linkService.create({
                    [Modules.USER]: { user_id: user.id },
                    [Modules.STORE]: { store_id: store.id },
                })

                // f) Links: Empresa ↔ Store
                await linkService.create({
                    [Modules.STORE]: { store_id: store.id },
                    [EMPRESA_MODULE]: { empresa_id: empresa.id },
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
