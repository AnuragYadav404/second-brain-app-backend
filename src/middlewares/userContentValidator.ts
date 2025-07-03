import { NextFunction, Request, Response } from "express";
import { userContentSchema } from "../zodSchemas/userContentSchema";


export const userContentValidator = (req: Request, res: Response, next: NextFunction) => {
     // validate user credentials from req.body
    const {success} = userContentSchema.safeParse(req.body);
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