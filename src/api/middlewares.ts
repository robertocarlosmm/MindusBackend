import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { PostEmpresaSchema } from "./admin/empresa/validators"
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
    ],
})