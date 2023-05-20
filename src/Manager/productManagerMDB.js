import productModel from '../Dao/models/product.js';

export default class ProductManager {

   constructor() {
      this.products = [];
   }

   updateProduct = async (id, updatedFields) => {
      try {
         const result = await productModel.updateOne({ _id: id }, { $set: updatedFields })
         if (result) {
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
         const result = await productModel.deleteOne({ _id: id })
         let products;
         if (result) {
            products = await this.getProducts();
         }
         return products
      } catch (error) {
         console.error('Error en deleteProduct:', error);
         throw error;
      }
   }

   // retorno todos los producto
   getProducts = async (limit, page, category, stock, sort) => {
      try {
         if (!limit || Number.isNaN(limit)){
            limit = 1;
         }
         if (!page || Number.isNaN(page)){
            page = 1;
         }
         let products;
         let prevLink;
         let nextLink;
         const query = {};
         const options = {
            limit: limit,
            page: page,
            lean: true
          };
         if (category){
            query.category = category;
         }
         if (stock) {
            query.stock = { $gte: stock };
          }
          if (sort) {
            options.sort = sort;
          }
          const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate(query, options);
          products = docs;
          if (hasPrevPage) {
             prevLink = `/products?page=${prevPage}`;
          }
          if (hasNextPage) {
             nextLink = `/products?page=${nextPage}`;
          }
          const result = {
              products,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              prevLink,
              nextLink
          }
         return result;
      } catch (error) {
         console.error('Error en getProducts:', error);
         throw error;
      }
   }

   // retorno los productos buscando por id (numerico autoincremental)
   getProductById = async (id) => {
      try {
         const result = await productModel.find({ _id: id });
         return result;
      } catch (error) {
         console.error('Error en getProductById:');
         throw error;
      }
   }

   // agrego los productos
   addProduct = async (productInfo) => {
      try {
         const { title, description, price, thumbnail, code, stock, category } = productInfo
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
      let product
      if (products.products.length > 0) {
         product = [...products.products].find(product => product.code === code);
      }

      if (product) {
         return product;
      } else {
         return null
      }
   }
}
