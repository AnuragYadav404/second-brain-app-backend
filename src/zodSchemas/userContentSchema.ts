import {z} from "zod";

// How to do zod validation:
// Define a schema
export const userContentSchema = z.object({
    title: z.string().min(3, "Content title must be of minimum 3 characters").max(16, "Content title can be maximum of 16 characters"),
    link: z.string().min(3, "link must be of minimum 3 characters").max(100, "link can be maximum of 100 characters"),
    type: z.string().min(3, "type must be of minimum 3 characters").max(16, "type can be maximum of 16 characters"),
})

// Declare a type, this becomes useful when exporting types to frontend
export type FinalUserContentSchema = z.infer<typeof userContentSchema>
