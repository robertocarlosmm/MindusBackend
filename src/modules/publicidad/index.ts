import PublicidadModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PUBLICIDAD_MODULE = "publicidad"

export default Module(PUBLICIDAD_MODULE, {
    service: PublicidadModuleService,
})