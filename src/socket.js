import { Server } from 'socket.io';
import ProductManagerDB from './dao/ProductManagerDB.js';
import CartManagerDB from './dao/CartManagerDB.js';
import UserManagerDB from './dao/UserManagerDB.js';

let io;
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();
const userManager = new UserManagerDB();

export const init = (httpServer) =>{
    io = new Server(httpServer);
    const messages = [];
    io.on('connection', async (socketClient) =>{
        console.log(`Nuevo cliente conectado con id: ${socketClient.id}`);
        //let carts = await cartManager.getCarts();
        let products = await productManager.getProducts();
        //socketClient.emit("carts", carts);
        //console.log(carts.docs);
        //socketClient.emit("products", products.docs);//Envio los productos al cliente para que los muestre actualizados
        socketClient.emit('listaProductos', products.docs);
        
        socketClient.on("message", data =>{
            //console.log(`Mensaje: ${data.message}`);
            messages.push(data);

            io.emit("messagesLogs", messages);
        });

        socketClient.on("userConnect", data =>{
            socketClient.emit("messagesLogs", messages); //Para que cuando se conecte el usuario le aparezcan todos los mensajes
            socketClient.broadcast.emit("newUser", data); //Emito evento a todos los demas usuarios de que un nuevo usuario de conecto
        });
        

        socketClient.on('addProduct', async (newProduct) =>{
            await productManager.addProduct(newProduct);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products.docs);
        });

        socketClient.on('deleteProductById', async (idDelete) =>{
            await productManager.deleteProduct(idDelete);
            let products = await productManager.getProducts();
            io.emit('listaProductos', products.docs);
        });
        /*-----------USER---------*/
        socketClient.on('registerForm', async (newUser) =>{
            try {
                await userManager.registerUser(newUser);
                socketClient.emit("registrationSuccess", "Registration completed successfully!")
            } catch (error) {
                socketClient.emit("registratrionError", error.messages);
            }
        });

        socketClient.on('disconnect', () =>{
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`);
        });
    });
    console.log('✅ Server socket running');
};