import express, { request, Request, response, Response } from "express";
import {z} from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "./models/UserModel";
import { connection } from "./config/DBConnecton";
import { userSignupSchema, FinalUserSignupSchema } from "./zodSchemas/userSignupSchema";
import { userCredentalValidator } from "./middlewares/userCredentialValidator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;


dotenv.config();
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



app.post("/api/v1/signup", userCredentalValidator,async (req: Request, res: Response) => {

    // Hashing the password and storing it
    const signupBody: FinalUserSignupSchema = req.body;    
    const hashedPassword = await bcrypt.hash(signupBody.password, 5);
    // Now we need to store the User in the database with the corresponding credentials :-)
    // Might also need to check whether the username is already taken or not
    // Unique constraint already does this for us
    try {
        await UserModel.create({
            username: signupBody.username,
            hashedPassword: hashedPassword
        })    
         res.status(200).json({
            message: "Sign up Successful!"
        })
    }catch(e: any) {
        console.log("DB Error:", e);
        if (e.code=== 11000) {
            res.status(409).json({ message: "Username already taken" });
            return;
        }
        res.status(500).json({ message: "Server error, try again later"});
        return;
    }
})


app.post("/api/v1/signin", userCredentalValidator, async (req: Request, res: Response) => {
    // now here, we need to generate token for the frontend
    // token lifecycle is not being implemented here
    const signinBody: FinalUserSignupSchema = req.body;
    const userFromDatabase = await UserModel.findOne({
        username: signinBody.username
    })
    // now we compare the password hash
    if (!userFromDatabase) {
        res.status(403).json({
            message: "This user does not exist"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(signinBody.password, userFromDatabase.hashedPassword);

    if(passwordMatch) {
        const token = jwt.sign({
            id:userFromDatabase._id.toString()
        },JWT_SECRET);

        res.status(200).json({
            token
        })

    }else {
        res.status(403).json({
            message: "Invalid credentials"
        })
        return;
    }

})


connection.then(() => {
    console.log("Database connected")
    app.listen(3000, () => {
        console.log("🚀 Server running on port 3000");
    });
});