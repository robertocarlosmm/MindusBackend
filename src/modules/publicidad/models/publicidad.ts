import { model } from "@medusajs/framework/utils"

const Publicidad = model.define("publicidad", {
    id: model.id().primaryKey(),

    // Campos obligatorios
    fechaInicio: model.dateTime(),
    fechaFin: model.dateTime(),

    // Campos opcionales
    observacion: model.text().nullable(), // Observaciones adicionales
})

export default Publicidad
