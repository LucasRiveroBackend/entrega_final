import { Router } from 'express';
import { getProducts, getProduct, updateProduct, addProduct, deleteProduct } from '../controllers/products.controllers.js';

const router = Router();

router.get('/', getProducts)

router.get('/:pid', getProduct)

router.post('/', addProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

export default router;