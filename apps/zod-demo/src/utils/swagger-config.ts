import { Hono } from "hono";
import { setupSwagger } from "@packages/zod-decorator";
import * as Dtos from "../dtos";
import * as Enums from "../enums";
import * as Response from "../response";
export function swaggerConfig(app: Hono, prefix: string) {
    setupSwagger(app, prefix, {
        info: {
            title: "Zod Demo",
            description: "Zod Demo Swagger",
            version: "1.0.0",
        },
        schemas: { ...Dtos, ...Response },
        enumSchemas: { ...Enums }
    });
}