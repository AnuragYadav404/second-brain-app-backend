"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userShareSchema = void 0;
const zod_1 = require("zod");
// How to do zod validation:
// Define a schema
exports.userShareSchema = zod_1.z.object({
    share: zod_1.z.boolean(),
});
