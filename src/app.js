import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import __dirname from "./utils.js";
import viewRouter from "./routes/view.router.js";
import realTimeProducts from "./routes/realTimeProducts.js";
import MessageManager from "./Manager/MessageManagerMDB.js";
import ProductsManagar from "./Manager/productManager.js";
import cartModel from "./Dao/models/carts.js";
import productModel from "./Dao/models/carts.js";

const manager = new ProductsManagar();
const PORT = 8080;
const MONGO = 'mongodb+srv://Resumenes:Resumenes@cluster0.fbw6l.mongodb.net/ecommerce?authSource=admin&replicaSet=atlas-8qggok-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const app = express();
const connection = mongoose.connect(MONGO);
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use("/realtimeproducts", realTimeProducts);

const server = app.listen(PORT, () => {
  console.log("Servidor funcionando en el puerto: " + PORT);
});


//Chat socket.io
const messageManager = new MessageManager();
const io = new Server(server);
const messages = [];
io.on('connection', Socket =>{

    console.log('Socket connected');

    Socket.on('message', data=>{
      
      const result = messageManager.addMessage(data);
        messages.push(data);
        io.emit('messageLogs', messages)
    })
    Socket.on('authenticated', data =>{
        
        Socket.broadcast.emit('newUserConnected', data)

     })

})