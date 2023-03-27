import fs from 'fs';
const path = './files/Productos.json';

export default class ProductManager {

   constructor() {
      this.path = path;
      this.products = [];
   }

   updateProduct = async (id, updatedFields) => {
      try {
         const products = await this.getProducts();

         const index = products.findIndex(product => product.id === id);
         if (index !== -1) {
            const updatedProduct = { ...products[index], ...updatedFields };

            products[index] = updatedProduct;

            this.write(products);
            return updatedProduct
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
         const idExiste = await this.getProductById(id);
         // validao si el id ingresado existe
         if (idExiste === 'Not found'){
            return 'No existe producto que quiere eliminar'
         }
         // busco todos los productos
         const products = await this.getProducts();
         // filtro por aquellos que sean distintos al id que recibi
         const filteredProducts = products.filter(product => product.id !== id);
         // grabo todos aquellos que son distintos al id que recibi
         this.write(filteredProducts);
         return filteredProducts
      } catch (error) {
         console.error('Error en deleteProduct:', error);
         throw error;
      }
   }

   // retorno todos los producto
   getProducts = async () => {
      try {
         if (fs.existsSync(this.path)) {
            const data = await fs.readFileSync(this.path, 'utf8')
            const products = JSON.parse(data);
            this.products = products;
            return this.products;
         } else {
            return [];
         }
      } catch (error) {
         console.error('Error en getProducts:', error);
         throw error;
      }
   }

   // retorno los productos buscando por id (numerico autoincremental)
   getProductById = async(id) => {
      try {
         const product = await this.getProducts();
         if (product) {
            let productFilter = await this.products.find(product => product.id === id);
            if (productFilter){
               return productFilter
            }else{
               return 'Not found';
            }
         } else {
            return 'Not found';
         }
      } catch (error) {
         console.log('Id sin producto2')
         console.error('Error en getProductById:', error);
         throw error;
      }
   }

   // agrego los productos
   addProduct = async (title, description, price, thumbnail, code, stock) => {
      try {
         let productsMaxId = await this.getProducts();
         let maxId = 0

         for (let i = 0; i < productsMaxId.length; i++) {
            if (productsMaxId[i].id > maxId) {
               maxId = productsMaxId[i].id;
            }
         }

         if (!title || !description || !price || !thumbnail || !code || !stock) {
            return 'Todos los campos son obligatorios';
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
            id: ++maxId
         }

         this.products.push(product);

         await this.write(this.products);

         return this.products;
      } catch (error) {
         console.error('Error en addProduct:', error);
         throw error;
      }
   }

   write = async (product) => {
      try {
         await fs.writeFileSync(this.path, JSON.stringify(product, null, '\t'))
      } catch (error) {
         console.error('Error en write:', error);
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
