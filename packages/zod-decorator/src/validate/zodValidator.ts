import { MiddlewareHandler } from 'hono';
import { ZodArray, ZodNullable, ZodObject, ZodOptional, ZodSchema, ZodType } from 'zod';
import { handleErrors } from '../utils';

type SourceType = 'json' | 'query' | 'header';

export const zodValidator = <T extends ZodSchema<any>>(
  schema: T,
  source: SourceType = 'json',
  ctxKey: string
): MiddlewareHandler => {
  return async (c, next) => {
    let data: any;

    if (source === 'json') {
      data = await c.req.json()
    }
    else if (source === 'query') {
      const arrayField = extractArrayFields(schema)
      data = c.req.query();

      arrayField.forEach(field => {
        const queries = c.req.queries(field) || c.req.queries(`${field}[]`)
        data[field] = queries
      })
    }
    else if (source === 'header') data = c.req.header();

    const result = schema.safeParse(data);
    if (!result.success) {
      const rs = handleErrors(result.error.issues);
      return c.json(
        rs,
        200,
      );
    }

    c.set(ctxKey, result.data);
    await next();
  };
};

function extractArrayFields(schema: ZodSchema<any>): string[] {
  const arrayFields: string[] = [];

  function processSchema(currentSchema: ZodType<any>, path: string = '') {
    if (currentSchema instanceof ZodOptional || currentSchema instanceof ZodNullable) {
      return processSchema(currentSchema._def.innerType, path);
    }

    if (currentSchema instanceof ZodArray) {
      if (path) {
        arrayFields.push(path);
      }
    }

    if (currentSchema instanceof ZodObject) {
      const shape = currentSchema._def.shape();

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const newPath = path ? `${path}.${key}` : key;
        processSchema(fieldSchema as any, newPath);
      }
    }
  }

  processSchema(schema);
  return arrayFields;
}