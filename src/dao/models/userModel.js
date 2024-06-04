import mongoose from "mongoose";
import { createHash } from "../../utils/functionsUtils.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type : String },
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: 18 },
    password: { type: String, required: true },
    role: { type: String, default: "Usuario" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }
}, { timestamps: true });

userSchema.pre('save', function() {
    this.password = createHash(this.password)
});


export const userModel = mongoose.model(userCollection, userSchema);