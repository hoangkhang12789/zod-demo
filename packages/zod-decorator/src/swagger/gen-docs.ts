import { createDocument } from "zod-openapi";
import { genSchemaComponents } from "./gen-components";
import { DocsSwagger } from "./interface";
import { OpenAPIV3_1 } from 'openapi-types';

export function genDocs(docs: DocsSwagger) {
    const document = createDocument({
        openapi: "3.1.0",
        info: docs.info
    }) as OpenAPIV3_1.Document;

    const schemasComponents = genSchemaComponents(docs.schemas);
    document.components = document.components || {};
    document.components.schemas = document.components.schemas || {};
    Object.assign(document.components.schemas, schemasComponents);

    return document;
}