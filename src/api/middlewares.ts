import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { PostEmpresaSchema } from "./admin/empresa/validators"
import { ProductoExtensionSchema } from "./AgregarDescripcion/validators"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/empresa",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(PostEmpresaSchema),
            ],
        },
        {
            matcher: "/admin/carga-masiva-empresa",
            method: ["POST"],
            middlewares: [upload.single("file")],
        },
        {
            matcher: "/AgregarDescripcion",      // coincide con /api/AgregarDescripcion/route.ts
            method: ["POST"],                    // tu endpoint es POST
            middlewares: [
                validateAndTransformBody(ProductoExtensionSchema),
            ],
        },
    ],
})