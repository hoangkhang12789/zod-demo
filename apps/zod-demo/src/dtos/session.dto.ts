import { z } from "@packages/zod-decorator";

export const SessionTokenDto = z.object({
    'x-session-token': z.string().describe("token session of the user")
}).openapi({ ref: 'SessionTokenDto' });