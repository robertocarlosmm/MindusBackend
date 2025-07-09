import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { PostEmpresaSchema } from "./admin/empresa/validators"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/empresa",
            method: ["POST"],
            middlewares: [
                validateAndTransformBody(PostEmpresaSchema),
            ],
        },
    ],
})