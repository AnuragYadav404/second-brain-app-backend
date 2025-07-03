"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userShareValidator = void 0;
const userShareSchema_1 = require("../zodSchemas/userShareSchema");
const userShareValidator = (req, res, next) => {
    // validate user credentials from req.body
    const { success, error } = userShareSchema_1.userShareSchema.safeParse(req.body);
    if (!success) {
        // we probably need to pass requried parse validation messages
        console.log(error);
        res.status(411).json({
            message: "Invalid Share option in request body"
        });
        return;
    }
    else {
        next();
    }
};
exports.userShareValidator = userShareValidator;
