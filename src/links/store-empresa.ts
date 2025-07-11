import StoreModule from "@medusajs/medusa/store"
import { defineLink } from "@medusajs/framework/utils"
import empresa from "../modules/empresa"

export default defineLink(
    StoreModule.linkable.store,
    empresa.linkable.empresa
);