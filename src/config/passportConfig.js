import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";

import { userModel } from "../dao/models/userModel.js";
import CartManagerDB from "../dao/CartManagerDB.js";
import UserManagerDB from "../dao/UserManagerDB.js";
import { isValidPassword } from "../utils/functionsUtils.js";

const cartManager = new CartManagerDB();
const userManager = new UserManagerDB();

const localStratergy = local.Strategy;
const initializatePassport = () => {
    const CLIENT_ID = "Iv23liN1vGnZdeF3fiD0";
    const SECRET_ID = "f069a8199cb77f3aa4884eeac5b2e5bf5881dc80";

    passport.use('github', new GitHubStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) =>{
            try {
                const email = profile._json.email || profile.profileUrl; // Por si email es null
                console.log(profile);

                const user = await userModel.findOne({ email: profile._json.email });

                if(!user){
                    let newUser = {
                        id: profile.id,
                        username: profile._json.login,
                        firstName: profile._json.name,
                        lastName: '',
                        age: 18,
                        password: '1234',
                        email: email,
                        role: "Usuario"
                    }

                    const registeredUser = await userManager.registerUser(newUser); //Registro el nuevo user
                    const cart = await cartManager.createCart(registeredUser._id); //Le creo un nuevo cart
                    const result = await userManager.createUserCart(registeredUser._id, cart._id); //Agrego el cart al usuario
                    
                    done(null, result);
                }else{
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userManager.findUserByEmail(username);
                if(user){
                    console.log("User already exist!");
                    return done(null, false);
                }

                const newUser = { first_name, last_name, email, password };
                const result = await userManager.registerUser(newUser);
                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.use('login', new localStratergy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                let user = await userManager.findUserByEmail(username);
                if(!user){
                    const errorMessage = 'User does not exist.';
                    console.log(errorMessage);
                    return done(errorMessage);
                }

                if(!isValidPassword(user, password)){
                    return done('Incorrect user or password.');
                }

                return done(null, user);
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializatePassport;