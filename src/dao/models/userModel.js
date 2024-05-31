import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type : String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Usuario" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }
}, { timestamps: true });


export const userModel = mongoose.model(userCollection, userSchema);