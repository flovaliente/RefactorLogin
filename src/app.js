import express from 'express';//
import handlebars from 'express-handlebars';//
import path from 'path';
import mongoose from 'mongoose';//
import session from 'express-session';//
import mongoStore from 'connect-mongo';//
import passport from 'passport';

import productsRouter from './routers/productsRouter.js';
import cartRouter from './routers/cartRouter.js';//
import indexRouter from './routers/indexRouter.js';//
import chatRouter from './routers/messageRouter.js';//
import userRouter from './routers/userRouter.js';//
import sessionRouter from './routers/sessionRouter.js';
import initializatePassport from './config/passportConfig.js';


/*
AppId: 908223
ClientId: Iv23liN1vGnZdeF3fiD0
Client Secret: f069a8199cb77f3aa4884eeac5b2e5bf5881dc80
*/

//import { __dirname } from './utils.js';
import  __dirname  from './utils/constUtil.js';

const app = express();

//MongoDB connect
const URI = 'mongodb+srv://developer:floPB2024@cluster0.5koqaoi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(URI);

//Middlewares
app.use(express.json());//
app.use(express.static('public'));//
app.use(express.urlencoded({ extended: true }));//
app.use("/js", express.static(__dirname + "/path/to/js"));
//Use express-session before passport
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: URI,
      ttl: 20,
    }),
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

 
//Handlebars config
app.engine('handlebars', handlebars.engine());//
app.set('views', __dirname + "/../views");//
app.set('view engine', 'handlebars');//

//Routers
app.use('/', indexRouter);//
app.use('/api/session', sessionRouter);
app.use('/api/users', userRouter);//
app.get('/realTimeProducts', indexRouter);
app.use('/api/products', productsRouter);//
app.use('/api/carts', cartRouter);//
app.use('/api/message', chatRouter);//

/*app.use((error, req, res, next) => {
  const message = `Ocurrio un error: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});*/

export default app;