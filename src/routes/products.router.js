import { Router } from 'express';
//import ProductManager from '../Manager/productManager.js';
import ProductManager from '../Manager/productManagerMDB.js';
const productManager = new ProductManager();
const router = Router();

router.get('/', async (req,res)=>{
   const limitString = req.query.limit;
   const limit = parseInt(limitString);

   const products = await productManager.getProducts();
   if(!limit){
      return res.send({
         productos: products
      })
   }
   if (Number.isNaN(limit)){
      return res.send({
         error: 'El limite debe ser numérico'
      })
   }
   let productsLimit = products.slice(0, limit );
   return res.send({
       productos: productsLimit
   })
})

router.get('/:pid', async (req, res)=>{
   const idString = req.params.pid
   const id = parseInt(idString);
   if (Number.isNaN(id)){
      return res.send({
         error: 'El id debe ser numérico'
      })
   }
   const product = await productManager.getProductById(id);
   if (product){
      return res.send({
         producto: product
      })
   }
})

router.post('/', async (req,res)=>{
   const product = req.body;
   const resultado = await productManager.addProduct(product)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

router.put('/:pid', async (req,res)=>{
   const id = req.params.pid;
   const product = req.body; 
   const parseId = parseInt(id);
   const resultado = await productManager.updateProduct(parseId, product)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

router.delete('/:pid', async (req,res)=>{
   const id = req.params.pid;   
   const parseId = parseInt(id);
   const resultado = await productManager.deleteProduct(parseId)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

export default router;