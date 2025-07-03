"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    // Here we check the user's given token
    // User will most like pass the token in req.headers["authorization"]
    const header = req.headers["authorization"];
    if (!header) {
        res.status(400).json({
            message: "Please provide token in request headers"
        });
    }
    else {
        const token = header;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (typeof decoded === "string") {
                res.status(403).json({
                    message: "Invalid token credential"
                });
                return;
            }
            req.userId = decoded.id;
            next();
        }
        catch (e) {
            res.status(403).json({
                message: "You are not logged in"
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
