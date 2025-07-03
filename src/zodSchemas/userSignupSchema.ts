import {z} from "zod";

// How to do zod validation:
// Define a schema
export const userSignupSchema = z.object({
    username: z.string().min(3, "Username must be of minimum 3 characters").max(16, "username can be maximum of 16 characters"),
    password: z.string().min(3, "Password must be of minimum 3 characters").max(16, "Password can be maximum of 16 characters")
})

// Declare a type, this becomes useful when exporting types to frontend
export type FinalUserSignupSchema = z.infer<typeof userSignupSchema>
