/*import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IUserModuleService, IProductModuleService, IStoreModuleService } from "@medusajs/framework/types";


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const userModuleService : IUserModuleService = req.scope.resolve(Modules.USER);
    const productModuleService : IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    const storeModuleService : IStoreModuleService = req.scope.resolve(Modules.STORE);

    //const [list, count] = await userModuleService.listAndCountUsers()
    //const [list, count] = await productModuleService.listAndCountProducts()
    const [list, count] = await storeModuleService.listAndCountStores()
    res.json({
        list,
        count
    });
}*/

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "subtitle",
            "description",
            "thumbnail",
            "store.id",
            "store.name",
            "store.users.id",
            "store.users.first_name",
            "store.users.last_name",
            "store.users.email",
        ],
    });

    const formatted = products.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        thumbnail: p.thumbnail,
        store: {
            id: p.store?.id || null,
            name: p.store?.name || null,
            user: {
                id: p.store?.users?.[0]?.id || null,
                first_name: p.store?.users?.[0]?.first_name || null,
                last_name: p.store?.users?.[0]?.last_name || null,
                email: p.store?.users?.[0]?.email || null,
            },
        },
    }));

    res.json({ products: formatted });
};
