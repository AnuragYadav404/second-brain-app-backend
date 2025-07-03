import express, { request, Request, response, Response } from "express";
import {z} from "zod"

const app = express();
app.use(express.json())
// need to define routes here

// Routes:
/* 
    /api/v1
    Authentication routes:
    /api/v1
    Sign up -> post -> /api/v1/signup
    Login -> post -> /api/v1/login

    Content Routes -> authenticated routes:
    Get Content Routes -> api/v1/contents
    create new content  -> POST-> api/v1/contents
    Get a particular content -> GET /api/v1/contents/:content_id
    update content route -> PUT -> /api/v1/contents/:content_id

    Share Routes:
    Access someone's shared content
    GET /api/v1/brain/:share_hash

    authenticated route
    Getting my own share hash
    GET /api/v1/brain/share

*/

// How to do zod validation:
// Define a schema
const userSignupSchema = z.object({
    username: z.string().min(3, "Username must be of minimum 3 characters").max(16, "username can be maximum of 16 characters"),
    password: z.string().min(3, "Password must be of minimum 3 characters").max(16, "Password can be maximum of 16 characters")
})

// Declare a type, this becomes useful when exporting types to frontend
type FinalUserSignupSchema = z.infer<typeof userSignupSchema>

app.post("/api/v1/signup", (req: Request, res: Response) => {
    // The user wants to sign-up

    // Retrieve the username and password from body fields
    // const username = req.body.username;
    // const password = req.body.password;

    ////Here we have to do two things:
    // 1. Validating input fields with Zod
    // Define valid Schema
    // Define type from the valid schema for frontend export
    const {success} = userSignupSchema.safeParse(req.body);

    if(!success) {
        res.status(411).json({
            message: "Invalid credentials"
        })
        return;
    }

    // 2. Hashing the password and storing it
    const signupBody: FinalUserSignupSchema = req.body;    
    // Need to hash and salt the password
    // need to verify during signin
    
})


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})