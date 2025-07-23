import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils"
import publicidad from "../modules/publicidad";

export default defineLink(
    ProductModule.linkable.product,
    { linkable: publicidad.linkable.publicidad, isList: true }
);