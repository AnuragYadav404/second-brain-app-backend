"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContentValidator = void 0;
const userContentSchema_1 = require("../zodSchemas/userContentSchema");
const userContentValidator = (req, res, next) => {
    // validate user credentials from req.body
    const { success, error } = userContentSchema_1.userContentSchema.safeParse(req.body);
    if (!success) {
        // we probably need to pass requried parse validation messages
        console.log(error);
        res.status(411).json({
            message: "Invalid Content Schema"
        });
        return;
    }
    else {
        next();
    }
};
exports.userContentValidator = userContentValidator;
