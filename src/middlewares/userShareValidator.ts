import { NextFunction, Request, Response } from "express";
import { userShareSchema } from "../zodSchemas/userShareSchema";


export const userShareValidator = (req: Request, res: Response, next: NextFunction) => {
     // validate user credentials from req.body
    const {success, error} = userShareSchema.safeParse(req.body);
    if(!success) {
        // we probably need to pass requried parse validation messages
        console.log(error)
        res.status(411).json({
            message: "Invalid Share option in request body"
        })
        return;
    }else {
        next();
    }
}