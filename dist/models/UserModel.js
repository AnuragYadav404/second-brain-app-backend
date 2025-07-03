"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, minLength: 3, maxLength: 16, unique: true },
    password: { type: String, required: true, minLength: 3, maxLength: 16 }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
