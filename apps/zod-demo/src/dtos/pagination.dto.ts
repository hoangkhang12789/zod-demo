import { z } from '@packages/zod-decorator';

export const BasePaginationDto = z.object({
  limit: z.coerce.number().nullable().optional(),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
});

export const paginationRefinement: Parameters<
  (typeof BasePaginationDto)['refine']
> = [
  (data: z.infer<typeof BasePaginationDto>): boolean => {
    return !(data.nextPageToken && data.prevPageToken);
  },
  {
    message: 'Only one of nextPageToken or prevPageToken may be provided',
  },
];

export const PaginationDto = BasePaginationDto.refine(
  ...paginationRefinement,
).openapi({
  ref: 'PaginationDto',
  oneOf: [
    {
      required: ['nextPageToken'],
    },
    {
      required: ['prevPageToken'],
    },
  ],
});
