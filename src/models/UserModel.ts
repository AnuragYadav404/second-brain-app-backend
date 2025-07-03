import { model, Schema } from "mongoose";
 
const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 3, maxLength: 16, unique: true },
    hashedPassword: { type: String, required: true}
})

export const UserModel = model("User", UserSchema);

