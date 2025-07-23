import { MedusaService } from "@medusajs/framework/utils"
import Publicidad from "./models/publicidad"


class PublicidadModuleService extends MedusaService({
    Publicidad,
}) { }

export default PublicidadModuleService