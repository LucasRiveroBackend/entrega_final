import { Router } from 'express';
//import ProductManager from '../Manager/productManager.js';
import ProductManager from '../Manager/productManagerMDB.js';
const productManager = new ProductManager();
const router = Router();

router.get('/', async (req,res)=>{
   
   const limitString = req.query.limit;
   const pageString = req.query.page;
   const category = req.query.category;
   const stockString = req.query.stock;
   const sort = req.query.sort
   
   let limit = parseInt(limitString);
   let page = parseInt(pageString);
   const stock = parseInt(stockString);

   if (!limit || Number.isNaN(limit)){
      limit = 10;
   }
   if (!page || Number.isNaN(page)){
      page = 1;
   }
   const products = await productManager.getProducts(limit, page, category, stock, sort);
   console.log()
   return res.send({
       productos: products
   })
})

router.get('/:pid', async (req, res)=>{
   const idString = req.params.pid
   const product = await productManager.getProductById(idString);
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
   const resultado = await productManager.updateProduct(id, product)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

router.delete('/:pid', async (req,res)=>{
   const id = req.params.pid;   
   const resultado = await productManager.deleteProduct(id)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
})

export default router;