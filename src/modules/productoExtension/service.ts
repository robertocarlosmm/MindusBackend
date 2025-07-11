import { MedusaService } from "@medusajs/framework/utils"
import ProductoExtension from "./models/productoExtension"


class ProductoExtensionModuleService extends MedusaService({
    ProductoExtension,
}) {
}
export default ProductoExtensionModuleService