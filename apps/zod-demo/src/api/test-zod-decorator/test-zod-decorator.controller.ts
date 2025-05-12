import { UserMetadataDto } from './../../dtos/user-metadata.dto';
import { AddUserStatusDto, CreateProductDto, GetProductDto, PaginationDto } from '../../dtos';
import { Context, Hono } from 'hono';
import { openAPI, zodValidator } from '@packages/zod-decorator'
import { CreateProductResponse, GetProductResponse } from '../../response';

const TestController = new Hono();

TestController.post(
    'create',
    openAPI({
        operationId: "create",
        tag: "test",
        request: CreateProductDto,
        response: CreateProductResponse,
        header: UserMetadataDto,
        dataSource: 'json'
    }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(CreateProductDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);

TestController.get(
    'get',
    openAPI({
        operationId: "get",
        tag: "test",
        request: GetProductDto,
        response: GetProductResponse,
        header: UserMetadataDto,
        dataSource: 'query'
    }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(GetProductDto, "query", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);
TestController.post(
    'add',
    openAPI({
        operationId: "add",
        tag: "test",
        request: AddUserStatusDto,
        response: CreateProductResponse,
        header: UserMetadataDto,
        dataSource: 'json'
    }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(AddUserStatusDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);

TestController.post(
    'getData',
    openAPI({
        operationId: "getData",
        tag: "test",
        request: PaginationDto,
        response: CreateProductResponse,
        header: UserMetadataDto,
        dataSource: 'json'
    }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(PaginationDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);
export default TestController