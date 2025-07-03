"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignupSchema = void 0;
const zod_1 = require("zod");
// How to do zod validation:
// Define a schema
exports.userSignupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be of minimum 3 characters").max(16, "username can be maximum of 16 characters"),
    password: zod_1.z.string().min(3, "Password must be of minimum 3 characters").max(16, "Password can be maximum of 16 characters")
});
