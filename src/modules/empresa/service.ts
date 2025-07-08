import { MedusaService } from "@medusajs/framework/utils"
import Empresa from "./models/empresa"

class EmpresaModuleService extends MedusaService({
    Empresa,
}) {
    async agregarRedSocial(idEmpresa, newLink) {
        const bussines = await this.retrieveEmpresa(idEmpresa)
        const updatedLinks = [...(bussines.redesSociales || []), newLink]
        return await this.updateEmpresas({ id: idEmpresa, redesSociales: updatedLinks })
    }
}
export default EmpresaModuleService