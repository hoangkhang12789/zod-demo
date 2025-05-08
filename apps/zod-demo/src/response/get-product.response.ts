import { z } from "@packages/zod-decorator";
import { GetProductDto } from "../dtos";

export const GetProductResponse = z.object({
    ok: z.boolean().describe('Get Product Result'),
    data: GetProductDto
}).openapi({ ref: "GetProductResponse" })
