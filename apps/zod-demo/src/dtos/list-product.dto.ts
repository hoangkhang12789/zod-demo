import { z } from '@packages/zod-decorator';
import { BasePaginationDto, paginationRefinement } from './pagination.dto';

export const ListProductDto = BasePaginationDto.merge(
  z.object({
    test: z.coerce.number().positive(),
    category: z.string().optional(),
    sortBy: z.enum(['price', 'name', 'createdAt']).optional()
  })
)
  .refine(...paginationRefinement)
  .openapi({
    ref: 'ListProductResponse'
  });