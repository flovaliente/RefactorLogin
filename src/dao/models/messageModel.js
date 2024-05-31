import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type : String, required: true }
}, { timestamps: true });

messageSchema.plugin(mongoosePaginate);

export const messageModel = mongoose.model(messageCollection, messageSchema);