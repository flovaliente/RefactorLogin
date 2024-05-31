import { Router } from 'express';
import CartManagerDB from '../dao/CartManagerDB.js';
import cartModel from '../dao/models/cartModel.js';
//import ProductManagerDB from '../dao/ProductManagerDB.js';


const router = Router();
const cartManager = new CartManagerDB();
//const productManager = new ProductManagerDB();

// -Create carts
router.post('/', async (req, res) => {
    try{
        const carts = await cartManager.createCart();
        res.status(200).send({
            status: 'success',
            payload: carts
        });
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message});
    }
});

// -Get carts
router.get('/', async (req, res) => {
    try {
        //const { query = {} } = req;
        const carts = await cartManager.getCarts();
        res.status(200).send({
            status: 'success',
            payload: carts
        });  
    } catch (error) {
        res.status(404).send({ 
            status: 'error',
            message: error.message
        });
    }
    
});

// -Get cart
router.get('/:cid', async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate("products.productId").lean();
        //const cart = await cartManager.getCartById(cid, true);
        console.log(cart.products);
        //res.send(cart);
        res.status(200).render('cart', cart);
    }catch (error){
        res.status(error.statusCode || 500).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
});

// -Actualizar el quantity
router.put('/:cid/product/:pid', async (req, res) =>{
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        console.log(quantity);

        await cartManager.updateQuantityCart(cid, pid, quantity);

        res.status(200).send({
            status:'success',
            message: 'Quantity updated successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: 'error',
            message: error.message}
        );
    }
});

// -Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {//Arreglar para pasarle quantity por body
    try{
        const { cid, pid } = req.params;
        await cartManager.addToCart(cid, pid);
        res.status(200).send({
            status:'success',
            message: 'Product successfully added to cart.'
        });
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message});
    }
    
});

// -Delete cart
router.delete('/:cid', async (req, res) =>{
    try {
        const { cid } = req.params;
        await cartManager.deleteCart(cid);
        res.status(200).send({
            status: 'Cart successfully deleted.'
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
    
});

// Delete product from cart
router.delete('/:cid/product/:pid', async (req, res) =>{
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProdFromCart(cid, pid);
        res.status(200).send({
            status: 'Product successfully deleted from cart.'
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;