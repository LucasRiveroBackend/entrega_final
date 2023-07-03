import { Router } from 'express';
import {
   addCart,
   getCarts,
   addProductInCart,
   getCart,
   deleteProductInCart,
   deleteCart,
   updateManyCart,
   updateQuantity,
   addCartInUser,
   addPurchase
}
   from '../controllers/cart.controllers.js';

 import {isUser} from '../middlewares/validations.js';


const router = Router();

router.post('/', addCart)

router.get('/', getCarts)

router.post("/:cid/product/:pid", isUser, addProductInCart)

router.get("/:cid", getCart)

router.delete('/:cid/product/:pid', deleteProductInCart)

router.delete('/:cid', deleteCart)

router.put('/:cid', updateManyCart)

router.put('/:cid/product/:pid', updateQuantity)

router.put('/:cid/user/:pid', addCartInUser)

router.get('/:cid/purchase', addPurchase)

export default router;