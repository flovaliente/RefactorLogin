import { Router } from 'express';
import ProductManagerDB from '../dao/ProductManagerDB.js';
import CartManagerDB from '../dao/CartManagerDB.js';
import { auth } from '../middlewares/auth.js';
import cartModel from '../dao/models/cartModel.js';
import productModel from '../dao/models/productModel.js';
import { userModel } from '../dao/models/userModel.js';

const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.render("welcome", { title: "Welcome | Valsaa", style: "home.css" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/register', async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/products");
    }
    res.render("register", {
      title: "Register | Valsaa",
      style: "login.css",
      failRegister: req.session.failRegister ?? false,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/products', async (req, res) => {
  try {
    const user = req.session.user;
    const { page = 1, limit = 10, category, stock, query, sort } = req.query;
    const options = { page, limit, sort: { price: sort || "asc"}, lean: true };
    const criteria = {};

    if(category){
      criteria.category = category;
    }

    if(query){
      query = JSON.parse(query);
      criteria.query = query;
    }
    
    let products = await productManager.getProducts(criteria, options);
    console.log(products);
    //let products = await productModel.find();
    //products = products.map((p) => p.toJSON());
    res.render("products", { 
      title: "Products | Valsaa", 
      style: "product.css", 
      user: user, 
      products: products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/cart', async (req, res) =>{
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid).populate("products.productId").lean();
    //let cart = await cartManager.getCartById(cid, true);
    console.log(cart);
    res.render("cart", { title: "Cart view", cart, style: "cart.css" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    let products = await productModel.find();
    products = products.map((p) => p.toJSON());
    res.render("home", { title: "RealTime-Products ", style: "RTP.css", products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/login', async (req, res) => {
  try {
    if(req.session.user){
      res.redirect("/products");
    }else{
      res.render("login", {
        title: "Valsaa | Login",
        style: "login.css",
        failLogin: req.session.failLogin ?? false,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

export default router;