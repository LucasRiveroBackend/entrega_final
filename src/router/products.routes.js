import { Router } from 'express';
import { getProducts, getProduct, updateProduct, addProduct, deleteProduct } from '../controllers/products.controllers.js';
import { isAdmin } from '../middlewares/validations.js';

const router = Router();

router.get('/', getProducts)

router.get('/:pid', getProduct)

router.post('/', isAdmin, addProduct)

router.put('/:pid', isAdmin, updateProduct)

router.delete('/:pid', isAdmin, deleteProduct)

export default router;