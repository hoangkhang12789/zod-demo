import { z } from '@packages/zod-decorator'

export const PaginationDto = z.object({
  limit: z.number().nullable().optional(),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional()
})
  .refine(
    data =>
      !(data.nextPageToken && data.prevPageToken),
    {
      message: "Only one of nextPageToken or prevPageToken may be provided",
    }
  )
  .openapi({
    ref: "PaginationDto",
    oneOf: [
      {
        required: [
          "nextPageToken"
        ]
      },
      {
        required: [
          "prevPageToken"
        ]
      }
    ]
  }
  );
