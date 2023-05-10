import productModel from '../Dao/models/product.js';

export default class ProductManager {

   constructor() {
      this.products = [];
   }

   updateProduct = async (id, updatedFields) => {
      try {
         const result = await productModel.updateOne({id:id},{$set:updatedFields})
         if (result){
            return updatedFields
         } else {
            return 'No existe producto'
         }
      } catch (error) {
         console.error('Error en updateProduct:', error);
         throw error;
      }
   }


   deleteProduct = async (id) => {
      try {
         const result = await productModel.deleteOne({id:id})
         let products;
         if (result){
            products = await this.getProducts();
         }
         return products
      } catch (error) {
         console.error('Error en deleteProduct:', error);
         throw error;
      }
   }

   // retorno todos los producto
   getProducts = async () => {
      try {
         const result = await productModel.find();
         return result;
      } catch (error) {
         console.error('Error en getProducts:', error);
         throw error;
      }
   }

   // retorno los productos buscando por id (numerico autoincremental)
   getProductById = async(id) => {
      try {
         const result = await productModel.find({id:id});
         return result;
      } catch (error) {
         console.error('Error en getProductById:');
         throw error;
      }
   }

   // agrego los productos
   addProduct = async (productInfo) => {
      try {
         const {title, description, price, thumbnail, code, stock, category} = productInfo
         if (!title || !description || !price || !code || !stock || !category) {
            return 'Todos los campos son obligatorios';
         }
         let productsMaxId = await this.getProducts();
         let maxId = 0

         for (let i = 0; i < productsMaxId.length; i++) {
            if (productsMaxId[i].id > maxId) {
               maxId = productsMaxId[i].id;
            }
         }

         let codeExist = await this.findCode(code);

         if (codeExist) {
            return 'Codigo ya existente';
         }

         let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: ++maxId,
            category: category,
            status: true
         }

         const result = await productModel.create(product);

         return result;
      } catch (error) {
         console.error('Error en addProduct:', error);
         throw error;
      }
   }

   findCode = async (code) => {
      const products = await this.getProducts();
      // busco el codigo recibido, si existe retorno
      // el producto, si no existe retorno null
      let product = products.find(product => product.code === code)
      if (product) {
         return product;
      } else {
         return null
      }
   }
}
