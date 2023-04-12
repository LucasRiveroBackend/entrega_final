import fs from 'fs';
import ProductManager from './ProductManager.js';
const products = new ProductManager();
const path = './files/Carritos.json';

export default class CartsManager {

   constructor() {
      this.path = path;
      this.carts = [];
   }

   // agrego los productos
   addCarts = async () => {
      try {
         let cartsMaxId = await this.getCarts();
         let maxId = 0

         for (let i = 0; i < cartsMaxId.length; i++) {
            if (cartsMaxId[i].id > maxId) {
               maxId = cartsMaxId[i].id;
            }
         }

         let cart = {
            id: ++maxId,
            products: []
         }

         this.carts.push(cart);

         await this.write(this.carts);

         return this.carts;
      } catch (error) {
         console.error('Error en addCarts:', error);
         throw error;
      }
   }

   getCarts = async () => {
      try {
         if (fs.existsSync(this.path)) {
            const data = await fs.readFileSync(this.path, 'utf8')
            const carts = JSON.parse(data);
            this.carts = carts;
            return this.carts;
         } else {
            return [];
         }
      } catch (error) {
         console.error('Error en getCarts:', error);
         throw error;
      }
   }

   addProductInCart = async (idCart, idProd) => {
      try {
         const carts = await this.getCarts();
         const cartsFilter = carts.find((cart) => cart.id == idCart);
         let productInCart = cartsFilter.products;
         const prodIndex = productInCart.findIndex((u)=>u.id == idProd);

         if(prodIndex !== -1){
            productInCart[prodIndex].quantity ++; 
         }else{
            let producto = {
               id: idProd,
               quantity: 1
            };
            productInCart.push(producto);
         }

         await this.write(this.carts);

         return cartsFilter;
      } catch (error) {
         console.error('Error en addProductInCart:', error);
         throw error;
      }
   }

   write = async (cart) => {
      try {
         await fs.writeFileSync(this.path, JSON.stringify(cart, null, '\t'))
      } catch (error) {
         console.error('Error en write:', error);
         throw error;
      }
   }
}