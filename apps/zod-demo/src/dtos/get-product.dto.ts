import { z } from "@packages/zod-decorator";

export const GetProductDto = z.object({
  id: z.array(z.string()),
  name: z.string().optional()
}).openapi({ ref: "GetProductDto" });