import { Router } from 'express';
import passport from 'passport';

import UserManagerDB from '../dao/UserManagerDB.js';
import CartManagerDB from '../dao/CartManagerDB.js';
//import { userModel } from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionsUtils.js';

const router = Router();
const userManager = new UserManagerDB();
const cartManager = new CartManagerDB();

router.post('/register', passport.authenticate("register", { failureRedirect: "/api/session/failRegister" }), async (req, res) =>{
    try {
        const user = req.body;
        const result = await userManager.registerUser(user);
        const cart = await cartManager.createCart();
        await userManager.createUserCart(result._id, cart._id);
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
    
});

router.get('/failRegister', (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed register"
    });
});

router.post("/login", passport.authenticate("login", { failureRedirect: "api/session/failLogin" }), async (req, res) =>{
   const { email, password } = req.body; 
   try {
        req.session.failLogin = false;
        
        const user = await userManager.findUserByEmail(email)//Busco el usuario con email: email
        //console.log(user.password);
        //console.log(createHash(password));
        //console.log(email);
        if(!user){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if(!isValidPassword(user, password)){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        req.session.user = user;
        return res.redirect("/products");
    } catch (error) {
        req.session.failLogin = true;
        res.redirect("/login");
    }
    
});

router.get('/failLogin', (req, res) =>{
    res.status(400).send({
        status: "error",
        message: "Filed login"
    });
});

router.get('/logout', async (req, res) =>{
    req.session.destroy( error =>{
        res.redirect("/login");
    });
});

export default router;