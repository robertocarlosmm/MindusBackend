import EmpresaModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const EMPRESA_MODULE = "empresa"

export default Module(EMPRESA_MODULE, {
    service: EmpresaModuleService,
})