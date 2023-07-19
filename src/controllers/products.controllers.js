import ProductManager from "../Dao/manager/productManagerMDB.js";
import ProductModel from "../Dao/models/products.model.js";
import {loadProducts} from "../config/utils.js";
import {EError} from "../infrastructure/dictionaries/errors/EError.js";
import {CustomError} from "../services/customError.service.js";
import {generateProductErrorInfo} from "../services/productErrorInfo.js";
import {generateProductExternError} from "../services/productErrorExtern.js";
import { addLogger } from "../config/logger.js";

const productManager = new ProductManager(ProductModel);

export const getProducts = async (req,res)=>{
   
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
   return res.send({
       productos: products
   })
}

export const getProduct = async (req, res)=>{
   const idString = req.params.pid
   const product = await productManager.getProductById(idString);
   if (product){
      return res.send({
         producto: product
      })
   }
}

export const addProduct = async (req,res)=>{
   const product = req.body;
   const { title, description, price, thumbnail, code, stock, category } = req.body
   if (!title || !description || !price || !code || !stock || !category) {
      const customerError = await CustomError.createError({
         name: "Product create error",
         cause: generateProductErrorInfo(req.body),
         message: "Error creando el Producto",
         errorCode: EError.INVALID_JSON
       });
       req.logger.error('Error creando el Producto');
       return res.send({
         error:customerError,
       })
   }
   const resultado = await productManager.addProduct(product)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
}

export const updateProduct = async (req,res)=>{
   const id = req.params.pid;
   const product = req.body; 
   const resultado = await productManager.updateProduct(id, product)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
}

export const deleteProduct = async (req,res)=>{
   const id = req.params.pid;   
   const resultado = await productManager.deleteProduct(id)
   if(resultado){
      return res.send({
         producto:resultado,
      })
   }
}

export const addProductFaker = async (req,res)=>{
   const products = await loadProducts();
   let resultado;
   if (products.length > 0){
      resultado = await ProductModel.insertMany(products);
   }else{
      if (products.length === 0) {
         const customerError = await CustomError.createError({
            name: "Product create error",
            cause: generateProductExternError(req.body),
            message: "Error creando el Producto Faker",
            errorCode: EError.EXTERNAR_ERROR
          });
          req.logger.error('Error creando el Producto Faker');
          return res.send({
            error:customerError,
          })
      }
   }
   return res.send({
      productos: resultado
   })
}
