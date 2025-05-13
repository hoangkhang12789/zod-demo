import { z } from '@packages/zod-decorator';

export const PaginationDto = z.object({
  limit: z.coerce.number().nullable().optional(),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
}).openapi({
  ref: 'PaginationDto',
});

export const PaginationOpenAPI = {
  oneOf: [
    {
      required: ['nextPageToken'],
    },
    {
      required: ['prevPageToken'],
    },
  ]
}
export const PaginationValidate = (data) => {
  if (data.nextPageToken && data.prevPageToken) {
    return {
      message: 'Only one of nextPageToken or prevPageToken may be provided'
    };
  }
  return true;
};
