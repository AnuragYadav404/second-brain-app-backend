"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContentValidator = void 0;
const userContentSchema_1 = require("../zodSchemas/userContentSchema");
const userContentValidator = (req, res, next) => {
    // validate user credentials from req.body
    const { success } = userContentSchema_1.userContentSchema.safeParse(req.body);
    if (!success) {
        // we probably need to pass requried parse validation messages
        res.status(411).json({
            message: "Invalid credentials"
        });
        return;
    }
    else {
        next();
    }
};
exports.userContentValidator = userContentValidator;
