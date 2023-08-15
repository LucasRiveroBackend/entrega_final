import { Router } from 'express';
import { getProducts, getProduct, updateProduct, addProduct, deleteProduct, addProductFaker } from '../controllers/products.controllers.js';
import { isAdmin } from '../middlewares/validations.js';

const router = Router();

router.get('/', getProducts);

router.get('/:pid', getProduct);

router.post('/',  addProduct);

router.post('/mockingproducts', addProductFaker);

router.put('/:pid', updateProduct);

router.delete('/:pid', isAdmin, deleteProduct);

export default router;