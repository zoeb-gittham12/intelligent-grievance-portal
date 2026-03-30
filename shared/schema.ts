import { z } from "zod";

// Base fields shared across schemas
const complaintBaseSchema = z.object({
    title: z.string(),
    description: z.string().min(5, "Description must be at least 5 characters"),
    category: z.string(),
});

// Full complaint shape (e.g. API response)
export const complaintSchema = complaintBaseSchema.extend({
    id: z.number(),
    status: z.string(),
    predictedPriority: z.string().nullish(),
    predictedDepartment: z.string().nullish(),
    confidenceScore: z.number().nullish(),
    createdAt: z.string().nullish(),
    userId: z.number().nullish(),
});

export type Complaint = z.infer<typeof complaintSchema>;

// Insert schema reuses base without duplication
export const insertComplaintSchema = complaintBaseSchema;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
