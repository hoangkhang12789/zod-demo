import { ProductTypeEnum } from "../enums"
import { z } from "@packages/zod-decorator";

const PRODUCT_NAME_MAX_LENGTH = 255;
const PRODUCT_NAME_MIN_LENGTH = 2;

export const CreateProductExtentDto = z.object({
    name: z.string().trim().min(PRODUCT_NAME_MIN_LENGTH).max(PRODUCT_NAME_MAX_LENGTH),
    workspaceId: z.string().refine((value) => value === "0", {
        message: ' must be the string "0"',
    }),
    productAvatar: z.string().url().nullable().describe("product avatar"),
    productType: z.nativeEnum(ProductTypeEnum).nullable()
        .transform((val) => val ?? ProductTypeEnum.PRODUCT_TYPE_ENUM_CAR)
        .openapi({ effectType: "input", ref: "ProductTypeEnum" }),
    productData: z.string().min(1).refine((value) => {
        try {
            JSON.parse(value);
            return true;
        } catch (_) {
            return false;
        }
    }).transform((value) => JSON.parse(value)).describe("productData").optional()
}).openapi({ ref: 'CreateProductExtentDto' });