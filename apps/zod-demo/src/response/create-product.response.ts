import { z } from "@packages/zod-decorator";

export const CreateProductResponse = z.object({
    ok: z.boolean().describe('Create Product Result'),
}).openapi({ ref: "CreateProductResponse" })
