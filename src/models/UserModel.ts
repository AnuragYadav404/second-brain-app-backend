import { model, Schema } from "mongoose";
 
const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 3, maxLength: 16, unique: true },
    password: { type: String, required: true, minLength: 3, maxLength: 16 }
})

export const UserModel = model("User", UserSchema);

