import { z } from '@packages/zod-decorator'

export const UpdateUserStatusDto = z.object({
  content: z.string().trim().max(50).nullable(),
  status: z.string().emoji()
})
  .refine(
    data => data.content !== undefined || data.status !== undefined,
    {
      message: "Either content or status must be provided",
    }
  )
  .openapi({
    ref: "UpdateUserStatusDto",
    anyOf: [
      {
        required: [
          "content"
        ]
      },
      {
        required: [
          "status"
        ]
      }
    ]
  }
  );
