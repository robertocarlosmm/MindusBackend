import ProductoExtensionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PROUCTOEXTENSION_MODULE = "productoExtension"

export default Module(PROUCTOEXTENSION_MODULE, {
    service: ProductoExtensionModuleService,
})