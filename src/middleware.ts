import { NextFunction, Request, Response } from "express";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.userId = "abracadabara";
    next();
}