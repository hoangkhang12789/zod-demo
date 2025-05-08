import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { genDocs } from "./gen-docs";
import { DocsSwagger } from "./interface";

export function setupSwagger(app: Hono, prefix: string, docs: DocsSwagger) {
    const basePath = prefix ? `/${prefix}` : '';

    const openApiSpecs = openAPISpecs(app, {
        documentation: genDocs(docs) as any,
    })

    // Json For Client
    app.get(`${basePath}/docs`, async (c) => {
        const result = await openApiSpecs(c, async () => { });
        const res = await (result as Response).json();
        for (const route in res.paths) {
            for (const method in res.paths[route]) {
                if (res.paths[route][method].parameters) {
                    res.paths[route][method].parameters = res.paths[route][method].parameters.filter(
                        param => param.in !== "header"
                    );
                }
            }
        }
        return c.json(res);
    });

    // Json For Swagger UI
    app.get(`${basePath}/openapi`, openApiSpecs);

    app.get(`${prefix ? `/${prefix}` : ''}/ui`, swaggerUI({ url: `${prefix ? `/${prefix}` : ''}/openapi` }));
}