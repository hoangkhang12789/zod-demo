import { UserMetadataDto } from './../../dtos/user-metadata.dto';
import { AddUserStatusDto, CreateProductDto, GetProductDto, ListProductDto, PaginationDto, ReportDto } from '../../dtos';
import { Context, Hono } from 'hono';
import { openAPI, zodValidator } from '@packages/zod-decorator'
import { CreateProductResponse, GetProductResponse, ListProductResponse } from '../../response';

const TestController = new Hono();

TestController.post(
    'create',
    // openAPI({
    //     operationId: "create",
    //     tag: "test",
    //     request: CreateProductDto,
    //     response: CreateProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'json'
    // }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(CreateProductDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);

TestController.get(
    'get',
    // openAPI({
    //     operationId: "get",
    //     tag: "test",
    //     request: GetProductDto,
    //     response: GetProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'query'
    // }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(GetProductDto, "query", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);

TestController.get(
    'list',
    // openAPI({
    //     operationId: "list",
    //     tag: "test",
    //     request: ListProductDto,
    //     response: ListProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'query'
    // }),
    zodValidator(UserMetadataDto, "header", 'header'),
    zodValidator(ListProductDto, "query", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        const header = await c.get("header");
        return c.json([data,], 200);
    },
);

TestController.post(
    'add',
    // openAPI({
    //     operationId: "add",
    //     tag: "test",
    //     request: AddUserStatusDto,
    //     response: CreateProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'json'
    // }),
    zodValidator(UserMetadataDto, "header", 'header'),
    zodValidator(AddUserStatusDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);
TestController.post(
    'report',
    // openAPI({
    //     operationId: "report",
    //     tag: "test",
    //     request: ReportDto,
    //     response: CreateProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'json'
    // }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(ReportDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);
TestController.post(
    'getData',
    // openAPI({
    //     operationId: "getData",
    //     tag: "test",
    //     request: PaginationDto,
    //     response: CreateProductResponse,
    //     header: UserMetadataDto,
    //     dataSource: 'json'
    // }),
    zodValidator(UserMetadataDto, "header", 'data'),
    zodValidator(PaginationDto, "json", 'data'),
    async (c: Context) => {
        const data = await c.get("data");
        return c.json(data, 200);
    },
);
export default TestController