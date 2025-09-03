import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

// Helpers para query params
const getString = (v: any): string | undefined =>
    typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined

const getCsv = (v: any): string[] =>
    getString(v)?.split(",").map((s) => s.trim()).filter(Boolean) ?? []

const getInt = (v: any, def: number): number => {
    const n = parseInt(getString(v) || "", 10)
    return Number.isFinite(n) ? n : def
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })
    await client.connect()

    try {
        // 1. Paginación
        const size = getInt(req.query.page_size, 20)
        const currentPage = getInt(req.query.page, 1)
        const offset = (currentPage - 1) * size

        // 2. Filtros
        const storeId = getString(req.query.idStore)
        const categoryIds = getCsv(req.query.category_ids)

        const params: any[] = []
        const whereClauses: string[] = []

        if (storeId) {
            params.push(storeId)
            whereClauses.push(`s.id = $${params.length}`)
        }

        if (categoryIds.length) {
            params.push(categoryIds)
            whereClauses.push(
                `pcp.product_category_id = ANY($${params.length}::text[])`
            )
        }

        const whereSql = whereClauses.length
            ? `WHERE ${whereClauses.join(" AND ")}`
            : ""

        // 3. Total de registros
        const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM product p
      LEFT JOIN product_product_store_store ppss ON ppss.product_id = p.id
      LEFT JOIN store s ON s.id = ppss.store_id
      LEFT JOIN product_category_product pcp ON pcp.product_id = p.id
      LEFT JOIN product_category pc ON pc.id = pcp.product_category_id
      ${whereSql}
    `

        const countResult = await client.query(countQuery, params)
        const total = parseInt(countResult.rows[0]?.total || "0", 10)

        // 4. Query con datos
        const dataQuery = `
      SELECT DISTINCT p.*,
             pc.id   AS category_id,
             pc.name AS category_name,
             s.id    AS store_id,
             s.name  AS store_name,
             e.id    AS empresa_id,
             e."razonSocial" AS empresa_name,
             e.ruc   AS empresa_ruc
      FROM product p
      LEFT JOIN product_product_store_store ppss ON ppss.product_id = p.id
      LEFT JOIN store s ON s.id = ppss.store_id
      LEFT JOIN store_store_empresa_empresa see ON see.store_id = s.id
      LEFT JOIN empresa e ON e.id = see.empresa_id
      LEFT JOIN product_category_product pcp ON pcp.product_id = p.id
      LEFT JOIN product_category pc ON pc.id = pcp.product_category_id
      ${whereSql}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

        const dataResult = await client.query(dataQuery, [
            ...params,
            size,
            offset,
        ])

        await client.end()

        return res.json({
            total,
            page: currentPage,
            page_size: size,
            products: dataResult.rows,
        })
    } catch (err: any) {
        await client.end()
        console.error(err)
        return res.status(500).json({ error: err.message })
    }
}
