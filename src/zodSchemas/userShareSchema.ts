import {z} from "zod"

// How to do zod validation:
// Define a schema
export const userShareSchema = z.object({
    share: z.boolean(),
})

// Declare a type, this becomes useful when exporting types to frontend
export type FinalUserShareSchema = z.infer<typeof userShareSchema>
