import CartManager  from "../Dao/manager/CartManagerMDB.js";
import CartModel  from "../Dao/models/cart.model.js";
import productModel from "../Dao/models/products.model.js";
import {EError} from "../infrastructure/dictionaries/errors/EError.js";
import {CustomError} from "../services/customError.service.js";
import {generateCartErrorInfo} from "../services/cartErrorInfo.js";
import { addLogger } from "../config/logger.js";
const cartManager = new CartManager(CartModel);

export const addCart = async (req,res)=>{
   const cart = req.body;
   const resultado = await cartManager.addCarts(cart);

   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
}

export const getCarts = async (req,res)=>{
   const limitString = req.query.limit;
   const limit = parseInt(limitString);

   const carts = await cartManager.getCarts();
   if(!limit){
      return res.send({
         carts: carts
      })
   }
   if (Number.isNaN(limit)){
      req.logger.error('El limite debe ser numérico');
      return res.send({
         error: 'El limite debe ser numérico'
      })
   }
   let cartsLimit = carts.slice(0, limit );
   return res.send({
       carts: cartsLimit
   })
}

export const addProductInCart = async (req, res) => {
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   // busco el producto
   const product = await productModel.findById(idProd);
   if (!product){
      return res.send({status:"error", message:"no existe este producto"})
   }
   // si tengo producto para ese id valido si el owner es igual al id del usuario y si este es premium

   const productOwer = JSON.parse(JSON.stringify(product.owner));
   let userId;
   let userRol;
   if (typeof req.user === 'undefined'){
      // validacion para pruebas
      userId = productOwer;
      userRol = "usuario";
   }else{
      userId = JSON.parse(JSON.stringify(req.user._id));
      userRol = req.user.rol;
   }


   if((userRol === "premium" && productOwer == userId)){
      return res.send({status:"error", message:"no puedes agregar este producto"})
   }else{
      const resultado = await cartManager.addProductInCart(idCart, idProd);
      return res.send({
         carts: resultado
     })
   }
}

export const getCart = async (req, res) => {
   const id = req.params.cid;
   const carts = await cartManager.getCartsById(id);
   res.send({
      cart:carts
   });
}

export const deleteProductInCart = async (req,res)=>{
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   const resultado = await cartManager.deleteProductInCart(idCart, idProd);
   return res.send({
      carts: resultado
  })
}

export const deleteCart = async (req,res)=>{
   const idCart = req.params.cid;
   const resultado = await cartManager.deleteCart(idCart);
   return res.send({
      carts: resultado
  })
}

export const updateManyCart = async (req,res)=>{
   const idCart = req.params.cid;
   const products = req.body;
   const resultado = await cartManager.updateManyCart(idCart, products);
   return res.send({
      carts: resultado
   })
}

export const updateQuantity = async (req,res)=>{
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   const quantityString = req.body.quantity;
   const quantity = parseInt(quantityString);
   const resultado = await cartManager.updateQuantity(idCart, idProd, quantity);
   return res.send({
      carts: resultado
   })
}

export const addCartInUser = async (req,res)=>{
   const idCart = req.params.cid;
   const idUser = req.params.pid;
   const resultado = await cartManager.addCartInUser(idCart, idUser);
   return res.send({
      carts: resultado
   })
}

export const addPurchase = async (req, res)=>{
   const id = req.params.cid;
   const email = JSON.stringify(req.session.user.email);
   if (!email) {
      const customerError = await CustomError.createError({
         name: "Product create error",
         cause: generateCartErrorInfo(req.body),
         message: "Error creando el Ticket",
         errorCode: EError.INVALID_JSON
       });
       req.logger.error('Error creando el Ticket');
       return res.send({
         error:customerError,
       })
   }
   const ticket = await cartManager.addPurchase(id, email);
   if (ticket.code === 201) {
      res.status(201).json({
         message: ticket.message
       });
    }
    res.send({
      ticket: ticket
    });

}