import express from "express";
import ProductManager from '../src/ProductManager/ProductManager.js';

const productManager = new ProductManager();
const PORT = 8080;

const app = express();

app.listen(PORT, ()=>{
    //console.log(`Servidor funcionando en el puerto ${ PORT }`)
    console.log('Servidor funcionando en el puerto: ' + PORT)
})

app.get('/products', async (req, res)=>{
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

app.get('/products/:pid', async (req, res)=>{
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