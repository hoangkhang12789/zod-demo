import { createSchema, } from "zod-openapi";
import { ZodType } from "zod";

type SchemaComponent = {
    enum?: unknown;
    [key: string]: any;
};

export function genEnumComponents(enums: Record<string, any>): object {
    let Schemas = {};

    for (const [enumName, enumSchema] of Object.entries(enums)) {
        if (isNativeEnum(enumSchema)) {
            const enumComponents = generateNativeEnumComponents(`V3${enumName}`.replace('Dto', 'Request'), enumSchema);
            if (enumComponents) {
                Schemas = {
                    ...Schemas,
                    ...enumComponents
                };
            }
        }
    }

    return Schemas;
}

export function genSchemaComponents(schemas: Record<string, any>): object {
    let Schemas = {};

    for (let [itemName, itemSchema] of Object.entries(schemas)) {
        if (!itemSchema || typeof itemSchema !== 'object') {
            continue;
        }

        if (!isZodType(itemSchema)) {
            continue;
        }

        const { components } = createSchema(itemSchema as ZodType, {
            schemaType: 'input',
            openapi: '3.1.0',
        });

        if (components) {
            for (const [key, value] of Object.entries(components)) {
                Schemas[key] = {
                    ...(Schemas[key] || {}),
                    ...value
                };
            }
        }
    }
    const components = Object.fromEntries(
        Object.entries(Schemas).filter(
            ([, value]) => !(value as SchemaComponent).enum
        )
    );
    return components;
}

function isZodType(obj: any): boolean {
    return (
        obj &&
        typeof obj === 'object' &&
        '_def' in obj &&
        typeof obj.parse === 'function' &&
        typeof obj.safeParse === 'function'
    );
}

function isNativeEnum(obj: any): boolean {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const keys = Object.keys(obj);
    if (keys.length === 0) return false;
    return keys.some(key => !isNaN(Number(key)));
}

function generateNativeEnumComponents(enumName: string, enumObj: any): object {
    try {
        const enumValues: any[] = [];
        const enumVarNames: string[] = [];

        const sampleValue = Object.keys(enumObj)[0];

        const isNumericEnum = !Number.isNaN(sampleValue);

        if (isNumericEnum) {
            Object.entries(enumObj).forEach(([key, value]) => {
                if (typeof value === 'number') {

                    enumValues.push(value);
                    enumVarNames.push(key);
                }
            });
        } else {
            Object.entries(enumObj).forEach(([key, value]) => {
                if (typeof value === 'string' && !enumValues.includes(value)) {
                    enumValues.push(key);
                    enumVarNames.push(value);
                }
            });
        }

        return {
            [enumName]: {
                type: isNumericEnum ? 'number' : 'string',
                enum: enumValues,
                'x-enum-varnames': enumVarNames
            }
        };

    } catch (error) {
        console.warn(`Failed to process enum: ${enumName}`, error);
        return {};
    }
}
