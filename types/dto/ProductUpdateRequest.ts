import { MediaType, ProductStatus } from "@/app/generated/prisma/browser";
import z from "zod";

const ProductStatusEnum = z.enum(ProductStatus);
const MediaTypeEnum = z.enum(MediaType);

const ProductUpdateRequestSchema = z.object({
    sku: z.string().max(50, "SKU must be at most 50 characters").optional(),
    name: z.string().max(100, "Name must be at least 2 characters").optional(),
    altNames : z.array(z.string().max(100, "Alt name must be at most 100 characters")).optional(),
    description: z.string().max(500, "Description must be at most 500 characters").optional(),
    stock : z.number().int().min(0).optional(),
    status: ProductStatusEnum.optional(),
    price : z.number().min(0).optional(),
    compareAt : z.number().min(0).optional(),
    brand : z.string().max(100).optional(),
    model : z.string().max(100).optional(),
    media : z.array(z.object({
        url : z.url(),
        type : MediaTypeEnum
    })
)
}).optional()


export default ProductUpdateRequestSchema

export type ProductUpdateRequest = z.infer<typeof ProductUpdateRequestSchema>