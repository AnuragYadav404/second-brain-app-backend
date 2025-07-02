import { model, Model, Schema } from "mongoose";

const TagSchema = new Schema({
    title: { type: String, required: true, minLength: 3, maxLength: 16, unique: true },
})

export const TagModel = model("Tag", TagSchema);