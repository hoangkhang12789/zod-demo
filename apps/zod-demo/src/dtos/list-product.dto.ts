import { z } from '@packages/zod-decorator';
import { PaginationDto, PaginationOpenAPI, PaginationValidate } from './pagination.dto';

export const ListProductDto = PaginationDto.extend({
  test: z.coerce.number().positive(),
  category: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional()
}
)
  .refine(PaginationValidate)
  .openapi({
    ref: 'ListProductResponse',
    ...PaginationOpenAPI
  });