import { z } from '@packages/zod-decorator';
import { GetProductDto, PaginationDto } from '../dtos';

export const ListProductResponse = z
  .object({
    data: z.array(GetProductDto).describe('List Product Result'),
  })
  .openapi({
    ref: 'ListProductResponse',
  });
