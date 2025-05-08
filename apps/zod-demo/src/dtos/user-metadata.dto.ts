import { z } from "@packages/zod-decorator";


export const UserMetadataDto = z.object({
    'x-user-id': z.string().min(11).describe('x-user identify'),
    'x-country-code': z.string().describe('code of x-country'),
    'x-client-ip': z.string().describe('ip of x-client'),
    'x-geo-data': z.string().describe('data of x-geo'),
    'x-device-id': z.string().describe('x-device identify'),

}).openapi({ ref: 'UserMetadataDto' });