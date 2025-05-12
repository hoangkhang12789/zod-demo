import { z } from '@packages/zod-decorator'
import { ProductTypeEnum } from '../enums';


export const AddUserStatusDto = z.object({
  content: z.string().trim().max(50).optional(),
  status: z.string().emoji().optional(),
  expireAfterTime: z.nativeEnum(ProductTypeEnum).openapi({ ref: "ProductTypeEnum", effectType: 'same' })
})
  .refine(
    data => data.content !== undefined || data.status !== undefined,
    {
      message: "Either content or status must be provided",
    }
  )
  .openapi({
    ref: "AddUserStatusDto",
    anyOf: [
      {
        required: [
          "content",
          "expireAfterTime",
        ]
      },
      {
        required: [
          "status",
          "expireAfterTime",
        ]
      }
    ]
  }
  );
