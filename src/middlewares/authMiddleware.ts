import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"

import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req:Request, res: Response, next: NextFunction) => {
    // Here we check the user's given token
    // User will most like pass the token in req.headers["authorization"]
    const header = req.headers["authorization"];
    if(!header){
        res.status(400).json({
            message: "Please provide token in request headers"
        })
    }else {
        const token = header;
        try {
            const decoded = jwt.verify(token as string, JWT_SECRET);
            if (typeof decoded === "string") {
                res.status(403).json({
                    message: "Invalid token credential"
                })
                return;    
            }
            req.userId = (decoded as JwtPayload).id;
            next()
        }catch (e) {
            res.status(403).json({
                    message: "You are not logged in"
            })
        }
        
    }

}