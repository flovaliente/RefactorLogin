import cartModel from './models/cartModel.js';
import productModel from './models/productModel.js';

class CartManagerDB {
    
    async createCart(){
        try {
            let result = await cartModel.create({ products: [] });
            console.log(`Cart created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating cart.`);
        }
    }

    async addToCart(cid, pid, quantity = 1){
        const cart = await cartModel.findOne({ _id: cid });//Obtengo el carrito con id cid
        if(!cart){
            throw new Error(`Cart with id: ${cid} do not exist.`);
        }
        //console.log('Cart:', cart);
        const productFind = cart.products.find( (cartProduct) => String(cartProduct.productId) === String(pid) );
        if(productFind){//Chequeo que exista o no el producto en el carrito
            productFind.quantity += quantity; //Si el producto existe en el carrito, le incremento la cantidad quantity
        }else{
            cart.products.push( { productId: pid, quantity: quantity }); //Si no existe, lo agrego con la cantidad quantity
        }
        await cart.save(); //Guardo el carrito
    }

    async getCarts(){
        try {
            return await cartModel.find().populate('products.productId'); //con populate me va a traer toda la info del producto
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find carts.`);
        }
    }

    async getCartById(cid, populate = false){
        try {
            return cart = await cartModel.findById(cid).populate("products.productId").lean();
        
            //if(populate)
                //return await cart.populate('products.productId');

            //return cart;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Cart with id: ${cid} do not exist.`);
        }
        
    }

    async updateCart(cid, pid){
        try {
            let cart = await cartModel.findOne({ _id: cid });
            let product = await productModel.findOne({ _id: pid });

            if(!cart){//No existe el carrito
                throw new Error(`Cart with id: ${cid} do not exist.`);
            }

            if(!product){//No existe el producto
                throw new Error(`Product with id: ${pid} do not exist.`);
            }

            return 
        } catch (error) {
            throw new Error(`Error updating cart.`)
        }
    }

    async updateQuantityCart(cid, pid, quantity){
        try {
            return cartModel.updateOne(
                { _id: cid, "products.productId": pid }, 
                { $set: { "products.$.quantity": quantity }}
            );
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error updating product quantity.`);
        }
    }

    async deleteCart(cid){
        try {
            const result = await cartModel.deleteOne({ _id: cid })

            if(result.deletedCount === 0){
                throw new Error(`Cart with id: ${cid} do not exist.`);
            }else{
              console.error(`Cart with id: ${cid} deleted successfully.`);  
            }

            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error deleting cart ${cid}.`);
        }
        

    }

    async deleteProdFromCart(cid, pid){
        try {
            return await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { productId: pid } }});
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error deleting product from cart.`);
        }
    }
}

export default CartManagerDB;