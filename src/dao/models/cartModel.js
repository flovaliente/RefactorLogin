import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartCollection = "carts";

const { Schema } = mongoose;

const Products = new Schema(
    [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
      },
    ], { _id: false } //para que no cree un nuevo id, ya que el producto ya existe y ya tiene id
);

const cartSchema = new mongoose.Schema({
    products: { type: [Products], default: [] }
}, { timestamps: true }); //incluye fecha y hora de creacion

cartSchema.plugin(mongoosePaginate);

export default mongoose.model(cartCollection, cartSchema);