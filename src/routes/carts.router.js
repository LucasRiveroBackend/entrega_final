import { Router } from 'express';
import CartManager from '../Manager/CartManagerMDB.js';
const cartManager = new CartManager();
const router = Router();

router.post('/', async (req,res)=>{
   const cart = req.body;
   const resultado = await cartManager.addCarts(cart);

   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

router.get('/', async (req,res)=>{
   const limitString = req.query.limit;
   const limit = parseInt(limitString);

   const carts = await cartManager.getCarts();
   if(!limit){
      return res.send({
         carts: carts
      })
   }
   if (Number.isNaN(limit)){
      return res.send({
         error: 'El limite debe ser numérico'
      })
   }
   let cartsLimit = carts.slice(0, limit );
   return res.send({
       carts: cartsLimit
   })
})

router.post("/:cid/product/:pid", async (req, res) => {
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   const resultado = await cartManager.addProductInCart(idCart, idProd);
   return res.send({
      carts: resultado
  })
})

router.get("/:cid", async (req, res) => {
   const id = req.params.cid;
   const carts = await cartManager.getCartsById(id);
   res.send({
      cart:carts
   });
})

router.delete('/:cid/product/:pid', async (req,res)=>{
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   const resultado = await cartManager.deleteProductInCart(idCart, idProd);
   return res.send({
      carts: resultado
  })
})

router.delete('/:cid', async (req,res)=>{
   const idCart = req.params.cid;
   const resultado = await cartManager.deleteCart(idCart);
   return res.send({
      carts: resultado
  })
})

router.put('/:cid', async (req,res)=>{
   const idCart = req.params.cid;
   const products = req.body;
   const resultado = await cartManager.updateManyCart(idCart, products);
   return res.send({
      carts: resultado
   })
})

router.put('/:cid/product/:pid', async (req,res)=>{
   const idCart = req.params.cid;
   const idProd = req.params.pid;
   const quantityString = req.body.quantity;
   const quantity = parseInt(quantityString);
   const resultado = await cartManager.updateQuantity(idCart, idProd, quantity);
   return res.send({
      carts: resultado
   })
})

router.put('/:cid/user/:pid', async (req,res)=>{
   const idCart = req.params.cid;
   const idUser = req.params.pid;
   const resultado = await cartManager.addCartInUser(idCart, idUser);
   return res.send({
      carts: resultado
   })
})

export default router;