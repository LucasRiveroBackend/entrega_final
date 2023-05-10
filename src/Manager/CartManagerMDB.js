import cartModel from '../Dao/models/carts.js';
import ProductManager from './productManager.js';

export default class CartsManager {

   constructor() {
      this.carts = [];
   }

   // agrego los productos
   addCarts = async () => {
      try {
         let cartsMaxId = await this.getCarts();
         let maxId = 0
         let idProduct = 0;
         let quantity = 0

         for (let i = 0; i < cartsMaxId.length; i++) {
            if (cartsMaxId[i].id > maxId) {
               maxId = cartsMaxId[i].id;
            }
         }

         let cart = {
            id: ++maxId,
            products: [
               // {
               //    idProduct: idProduct,
               //    quantity: quantity
               // }
            ]
         }

         const result = await cartModel.create(cart);

         return result;
      } catch (error) {
         console.error('Error en addCarts:', error);
         throw error;
      }
   }

   getCarts = async () => {
      try {
         const result = await cartModel.find();
         return result;
      } catch (error) {
         console.error('Error en getCarts:', error);
         throw error;
      }
   }

   getCartsById = async (id) => {
      try {
         const result = await cartModel.find({id:id});
         return result;
      } catch (error) {
         console.error('Error en getCarts:', error);
         throw error;
      }
   }

   addProductInCart = async (idCart, idProd) => {
      try {
        const carts = await this.getCartsById(idCart);
        const cart = carts.find((cart) => cart.id == idCart);
        let productInCart = cart.products;
        const prodIndex = productInCart.findIndex((product) => product.idProduct == idProd);
    
        if (prodIndex !== -1) {
          // Si el producto ya existe, incrementar la cantidad en 1
          productInCart[prodIndex].quantity++;
        } else {
          // Si el producto no existe, agregarlo al arreglo
          let producto = {
            idProduct: idProd,
            quantity: 1
          };
          productInCart.push(producto);
        }
    
        // Actualizar el arreglo de productos en el carrito utilizando el operador $inc
        await cartModel.updateOne({ id: idCart }, { "products": productInCart });
    
        return cart;
      } catch (error) {
        console.error('Error en addProductInCart:', error);
        throw error;
      }
    }

   // addProductInCart = async (idCart, idProd) => {
   //    try {
   //      const carts = await this.getCartsById(idCart);
   //      const cart = carts.find((cart) => cart.id == idCart);
   //      let productInCart = cart.products;
   //      const prodIndex = productInCart.findIndex((product) => product.idProduct == idProd);
    
   //      if (prodIndex !== -1) {
   //        // Si el producto ya existe, incrementar la cantidad en 1
   //        productInCart[prodIndex].quantity++;
   //      } else {
   //        // Si el producto no existe, agregarlo al arreglo
   //        let producto = {
   //          idProduct: idProd,
   //          quantity: 1
   //        };
   //        productInCart.push(producto);
   //      }
    
   //      // Actualizar el arreglo de productos en el carrito utilizando el operador $set
   //      await cartModel.updateOne({ id: idCart, "products.idProduct": idProd }, { $set: { "products.$.quantity": productInCart[prodIndex].quantity } });
    
   //      return cart;
   //    } catch (error) {
   //      console.error('Error en addProductInCart:', error);
   //      throw error;
   //    }
   //  }

   write = async (cart) => {
      try {
         await fs.writeFileSync(this.path, JSON.stringify(cart, null, '\t'))
      } catch (error) {
         console.error('Error en write:', error);
         throw error;
      }
   }
}