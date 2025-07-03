"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minLength: 3, maxLength: 16, unique: true },
});
exports.TagModel = (0, mongoose_1.model)("Tag", TagSchema);
