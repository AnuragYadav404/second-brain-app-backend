"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCredentalValidator = void 0;
const userSignupSchema_1 = require("../zodSchemas/userSignupSchema");
const userCredentalValidator = (req, res, next) => {
    // validate user credentials from req.body
    const { success } = userSignupSchema_1.userSignupSchema.safeParse(req.body);
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
exports.userCredentalValidator = userCredentalValidator;
