
import { z } from "@packages/zod-decorator";
export const ReportDto = z.object({
    pretendingTo: z.number().openapi({
        example: 0,
        description: "If value is 0, then reportReason is required."
    }),
    reportReason: z.string().optional().openapi({
        example: "Fake identity",
        description: "Required if pretendingTo is 0`",
    }),
})
    .refine((data) => {
        if (data.pretendingTo === 0) {
            return !!data.reportReason;
        }
    }, {
        message: "report Reason is required when pretendingTo is 0",
    })
    .openapi({
        ref: "Report",
        "if": {
            "properties": {
                "pretendingTo": { "const": 0 }
            },

            "required": ["pretendingTo"]

        },
        "then": {
            "required": ["reportReason"]
        }
    })
