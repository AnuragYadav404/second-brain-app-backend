import { NextFunction, Request, Response } from "express";
import { userSignupSchema } from "../zodSchemas/userSignupSchema";

export const userCredentalValidator = (req: Request, res: Response, next: NextFunction) => {
     // validate user credentials from req.body
    const {success} = userSignupSchema.safeParse(req.body);
    if(!success) {
        // we probably need to pass requried parse validation messages
        res.status(411).json({
            message: "Invalid credentials"
        })
        return;
    }else {
        next();
    }
}