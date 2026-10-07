import z from "zod";

const ProductStatusEnum = z.enum(["active", "inactive", "discontinued"]);
const MediaTypeEnum = z.enum(["image", "video", "document"]);

const ProductCreationRequestSchema = z.object({
    sku: z.string().max(50, "SKU must be at most 50 characters"),
    name: z.string().max(100, "Name must be at least 2 characters").max(200, "Name must be at most 200 characters"),
    altNames : z.array(z.string().max(100, "Alt name must be at most 100 characters")).optional().default([]),
    description: z.string().max(500, "Description must be at most 500 characters").optional(),
    stock : z.number().int().min(0),
    status: ProductStatusEnum.default("active"),
    price : z.number().min(0),
    compareAt : z.number().min(0).optional(),
    brand : z.string().max(100).optional(),
    model : z.string().max(100).optional(),
    media : z.array(z.object({
        url : z.url(),
        type : MediaTypeEnum
    })
)
})


export default ProductCreationRequestSchema

export type ProductCreationRequest = z.infer<typeof ProductCreationRequestSchema>