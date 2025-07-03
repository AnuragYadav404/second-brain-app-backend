"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContentSchema = void 0;
const zod_1 = require("zod");
// How to do zod validation:
// Define a schema
exports.userContentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Content title must be of minimum 3 characters").max(100, "Content title can be maximum of 100 characters"),
    link: zod_1.z.string().min(3, "link must be of minimum 3 characters").max(100, "link can be maximum of 100 characters"),
    type: zod_1.z.string().min(3, "type must be of minimum 3 characters").max(16, "type can be maximum of 16 characters"),
});
