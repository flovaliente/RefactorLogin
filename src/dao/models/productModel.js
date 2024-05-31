import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: String, default: true, enum: [true, false] },
    stock: { type: Number, required: true },
    category: { type: String, index: true, required: true },
    thumbnails: { type: Array, default: [] },
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.model(productCollection, productSchema);