import { CreateProductExtentDto } from "./create-product-extent.dto";
import { z } from "@packages/zod-decorator";
import { GetProductDto } from "./get-product.dto";

export const CreateProductDto = CreateProductExtentDto.extend({
    productItem: z.array(GetProductDto)
        .transform((arr) => arr.map((s) => s.name === "1")).describe("productItem"),
    name: z.string().trim().min(12).max(34)
}).openapi({ ref: 'CreateProductDto' });