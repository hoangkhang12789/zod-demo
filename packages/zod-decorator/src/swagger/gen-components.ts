import { createSchema, } from "zod-openapi";
import { ZodObject, ZodType } from "zod";

export function genSchemaComponents(schemas: Record<string, any>): object {
    let Schemas = {};

    for (let [itemName, itemSchema] of Object.entries(schemas)) {
        if (!itemSchema || typeof itemSchema !== 'object') {
            continue;
        }

        if (!isZodType(itemSchema)) {
            continue;
        }

        Schemas = {
            ...Schemas,
            ...genEnumSchema(itemSchema)
        };

        let { components } = createSchema(itemSchema as ZodType, {
            schemaType: 'input',
            openapi: '3.1.0',
        });

        const filteredComponents = Object.fromEntries(
            Object.entries(components as Record<string, any>).filter(
                ([_, value]) => !('enum' in value)
            )
        );
        if (components) {
            for (const [key, value] of Object.entries(filteredComponents)) {
                Schemas[key] = {
                    ...(Schemas[key] || {}),
                    ...value
                };
            }
        }
    }

    return Schemas;
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

function genEnumSchema(itemSchema) {
    let Schemas = {};
    try {
        const shape = itemSchema._def.shape();


        for (const [fieldName, fieldSchema] of Object.entries(shape)) {
            if ((fieldSchema as any)._def.typeName === 'ZodOptional') {
                if ((fieldSchema as any)._def.innerType && (fieldSchema as any)._def.innerType._def.innerType instanceof ZodObject && fieldName !== 'error') {
                    const item = (fieldSchema as any)._def.innerType._def.innerType;
                    Schemas = {
                        ...Schemas,
                        ...genEnumSchema(item)
                    };
                }

                if ((fieldSchema as any)._def.innerType instanceof ZodObject) {
                    const item = (fieldSchema as any)._def.innerType;
                    Schemas = {
                        ...Schemas,
                        ...genEnumSchema(item)
                    }
                }

            }

            if (fieldSchema instanceof ZodObject) {
                Schemas = {
                    ...Schemas,
                    ...genEnumSchema(fieldSchema)
                };
            }
            if ((fieldSchema as any)._def.innerType && (fieldSchema as any)._def.innerType._def?.typeName === 'ZodNativeEnum') {

                const ref = (fieldSchema as any)._def.zodOpenApi.openapi.ref;
                const value = Object.fromEntries(
                    Object.entries((fieldSchema as any)._def.innerType._def.values).filter(([key, val]) => isNaN(Number(key)) && typeof val === 'number')
                );
                const enumComponents = generateNativeEnumComponents(ref, value)
                if (enumComponents) {
                    Schemas = {
                        ...Schemas,
                        ...enumComponents
                    };
                }
            } else if ((fieldSchema as any)._def.values) {
                const ref = (fieldSchema as any)._def.zodOpenApi.openapi.ref;
                const value = Object.fromEntries(
                    Object.entries((fieldSchema as any)._def.values).filter(([key, val]) => isNaN(Number(key)) && typeof val === 'number')
                );
                const enumComponents = generateNativeEnumComponents(ref, value)
                if (enumComponents) {
                    Schemas = {
                        ...Schemas,
                        ...enumComponents
                    };
                }

            }
            else if ((fieldSchema as any)._def.typeName === 'ZodEffects') {

                const schema = (fieldSchema as any)._def.schema
                if (schema._def.innerType && schema._def.innerType._def?.typeName === 'ZodNativeEnum') {
                    const ref = (fieldSchema as any)._def.zodOpenApi.openapi.ref;
                    const value = Object.fromEntries(
                        Object.entries(schema._def.innerType._def.values).filter(([key, val]) => isNaN(Number(key)) && typeof val === 'number')
                    );
                    const enumComponents = generateNativeEnumComponents(ref, value)
                    if (enumComponents) {
                        Schemas = {
                            ...Schemas,
                            ...enumComponents
                        };
                    }
                }

            } else if ((fieldSchema as any)._def.typeName === 'ZodOptional') {

                if ((fieldSchema as any)._def.innerType._def.schema && (fieldSchema as any)._def.innerType._def.schema._def.typeName === 'ZodNativeEnum') {
                    const ref = (fieldSchema as any)._def.zodOpenApi.openapi.ref;
                    const value = Object.fromEntries(
                        Object.entries((fieldSchema as any)._def.innerType._def.schema._def.values).filter(([key, val]) => isNaN(Number(key)) && typeof val === 'number')
                    );
                    const enumComponents = generateNativeEnumComponents(ref, value)
                    if (enumComponents) {
                        Schemas = {
                            ...Schemas,
                            ...enumComponents
                        };
                    }

                }

            }
        }
        return Schemas
    } catch {
        return
    }
}

