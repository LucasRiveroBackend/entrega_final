import { Router } from 'express';
import CartManager from '../Manager/CartManager.js';
const cartManager = new CartManager();
const router = Router();

router.post('/', async (req,res)=>{
   const cart = req.body;
   const resultado = await cartManager.addCarts(cart)
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
   const carts = await cartManager.getCarts();
   const id = parseInt(req.params.cid);
   let productFind = carts.find((cart) => cart.id === id);
   res.send({
      cart:productFind
   });
})

export default router;