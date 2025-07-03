"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
const userSignupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be of minimum 3 characters").max(16, "username can be maximum of 16 characters"),
    password: zod_1.z.string().min(3, "Password must be of minimum 3 characters").max(16, "Password can be maximum of 16 characters")
});
app.post("/api/v1/signup", (req, res) => {
    // The user wants to sign-up
    // Retrieve the username and password from body fields
    // const username = req.body.username;
    // const password = req.body.password;
    const { success } = userSignupSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Invalid credentials"
        });
        return;
    }
    const signupBody = req.body;
    res.status(200).json({
        signupBody
    });
    //Here we have to do two things:
    // 1. Validating input fields with Zod
    // 2. Hashing the password and storing it
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
