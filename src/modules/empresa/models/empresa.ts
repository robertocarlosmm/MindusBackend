import { model } from "@medusajs/framework/utils"
import { t } from "@mikro-orm/core"
import { emit } from "process"

const Empresa = model.define("empresa", {
    id: model.id().primaryKey(),
    ruc: model.text(),
    razonSocial: model.text(),
    descripcionBreve: model.text(),
    descripcionExtensa: model.text().nullable(),
    logo: model.text().nullable(),
    cantidadTrabajadores: model.number().nullable(),
    categorias: model.array(),
    redesSociales: model.array().nullable(),
    ubicacion: model.text(),
    telefono: model.text(),
    email: model.text(),
    canalesDeAtencion: model.array().nullable(),
    politicaDeGarantia: model.text(),
    politicaDeDevolucion: model.text(),
    website: model.text().nullable(),
    horarioAtencion: model.text(),
    certificaciones: model.array().nullable(),
    premios: model.array().nullable(),
    procesosProductivos: model.text().nullable(),
    procesosControlCalidad: model.text().nullable(),
    añoFundacion: model.number(),
    idiomas: model.array().nullable(),
    paisesAtencion: model.array().nullable()
})

export default Empresa