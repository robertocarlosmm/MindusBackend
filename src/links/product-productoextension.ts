import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils"
import productoExtension from "../modules/productoExtension";

export default defineLink(
    ProductModule.linkable.product,
    productoExtension.linkable.productoExtension
);