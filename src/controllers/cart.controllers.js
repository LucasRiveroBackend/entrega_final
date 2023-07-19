import CartManager  from "../Dao/manager/CartManagerMDB.js";
import CartModel  from "../Dao/models/cart.model.js";
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

   const resultado = await cartManager.addProductInCart(idCart, idProd);
   return res.send({
      carts: resultado
  })
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
   const { email } = req.body;
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
   const ticket = await cartManager.addPurchase(id, email)

   res.send({
     ticket: ticket
   });
}