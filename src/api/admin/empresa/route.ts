import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import EmpresaModuleService from "../../../modules/empresa/service"
import { EMPRESA_MODULE } from "../../../modules/empresa"
import { z } from "zod"
import { PostEmpresaSchema } from "./validators"

type PostEmpresaType = z.infer<typeof PostEmpresaSchema>

export async function POST(
    req: MedusaRequest<PostEmpresaType>,
    res: MedusaResponse
) {
    const empresaModuleService: EmpresaModuleService = req.scope.resolve(EMPRESA_MODULE)
    const empresa = await empresaModuleService.createEmpresas(req.validatedBody)
    console.log(req.validatedBody)
    res.json({ empresa })
}