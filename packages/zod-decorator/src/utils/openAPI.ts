import { describeRoute, DescribeRouteOptions } from 'hono-openapi';
import { ZodType } from 'zod';
import { createSchema, CreateSchemaOptions } from 'zod-openapi';
import { zodToOpenAPIHeaderParams, zodToOpenAPIQueryParams } from './zod-to-open-api-query-params';

type SourceType = 'json' | 'query';

export function openAPI(data: {
    operationId: string,
    tag: string,
    request: ZodType,
    response: ZodType,
    header: ZodType,
    dataSource: SourceType
}) {

    const schemaOptions: CreateSchemaOptions = {
        schemaType: 'input',
        openapi: '3.1.0',
    }
    const { schema: responseSchema } = createSchema(data.response, { ...schemaOptions, schemaType: 'output' });

    const headerParams = zodToOpenAPIHeaderParams(data.header as any) ?? [];

    let options: DescribeRouteOptions = {
        tags: [data.tag],
        parameters: [...headerParams]
    };

    if (data.dataSource === 'json') {
        const { schema: requestSchema } = createSchema(data.request, schemaOptions);

        options = {
            ...options,
            requestBody: {
                content: {
                    "application/json": {
                        schema: requestSchema as any

                    },
                },
            }
        }
    }

    if (data.dataSource === 'query') {
        options.parameters = [
            ...headerParams,
            ...zodToOpenAPIQueryParams(data.request as any)
        ];

    }
    return describeRoute({
        operationId: data.operationId,
        ...options,
        responses: {
            "200": {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: responseSchema as any,
                    },
                },
            },
        },
    });
}
