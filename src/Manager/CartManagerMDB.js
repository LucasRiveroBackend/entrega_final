import cartModel from '../Dao/models/cart.js';
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
         for (let i = 0; i < cartsMaxId.length; i++) {
            if (cartsMaxId[i].id > maxId) {
               maxId = cartsMaxId[i].id;
            }
         }

         let cart = {
            id: ++maxId,
            products: [
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
         const result = await cartModel.find().populate('products.product');
         return result;
      } catch (error) {
         console.error('Error en getCarts:', error);
         throw error;
      }
   }

   getCartsById = async (id) => {
      try {
         const result = await cartModel.find({_id:id}).lean();
         return result;
      } catch (error) {
         console.error('Error en getCartsById:', error);
         throw error;
      }
   }

   addProductInCart = async (idCart, idProd) => {
      try {
        const carts = await this.getCartsById(idCart);
        const cart = carts.find((cart) => cart._id == idCart);
        console.log('cart: ', cart)
        let productInCart = cart.products;
        const prodIndex = productInCart.findIndex((product) => product._id == idProd);
    
        if (prodIndex !== -1) {
          // Si el producto ya existe, incrementar la cantidad en 1
          productInCart[prodIndex].quantity++;
        } else {
          // Si el producto no existe, agregarlo al arreglo
          let producto = {
            _id: idProd,
            quantity: 1
          };
          productInCart.push(producto);
        }
    
        // Actualizar el arreglo de productos en el carrito utilizando el operador $inc
        await cartModel.updateOne({ _id: idCart }, { "products": productInCart });
    
        return cart;
      } catch (error) {
        console.error('Error en addProductInCart:', error);
        throw error;
      }
    }

    deleteProductInCart = async (idCart, idProd) => {
      try {
        const carts = await this.getCartsById(idCart);
        const cart = carts.find((cart) => cart._id == idCart);
        let productInCart = cart.products;
        const filteredProducts = productInCart.filter((product) => product.idProduct != idProd);
        await cartModel.updateOne({ _id: idCart }, { "products": filteredProducts });
        const cartsUpdate = await this.getCartsById(idCart);
        return cartsUpdate;
      } catch (error) {
        console.error('Error en deleteProductInCart:', error);
        throw error;
      }
    }

    deleteCart = async (idCart) => {
      try {
        await cartModel.deleteOne({ _id: idCart });
        const cartsUpdate = await this.getCartsById(idCart);
        return cartsUpdate;
      } catch (error) {
        console.error('Error en deleteCart:', error);
        throw error;
      }
    }

    updateManyCart = async (idCart,prod) => {
      try {
         let cart = {
            _id: idCart,
            products: prod
         }

        await cartModel.insertMany(cart)
        return cart;
      } catch (error) {
        console.error('Error en updateManyCart:', error);
        throw error;
      }
    }

    updateQuantity = async (idCart, idProd, quantity) => {
      try {
        const carts = await this.getCartsById(idCart);
        const cart = carts.find((cart) => cart._id == idCart);
        let productInCart = cart.products;
        const prodIndex = productInCart.findIndex((product) => product._id == idProd);
    
        if (prodIndex !== -1) {
          // Si el producto ya existe, incrementar la cantidad en quantity
          productInCart[prodIndex].quantity += quantity;
        } else {
          // Si el producto no existe, agregarlo al arreglo
          let producto = {
            _id: idProd,
            quantity: quantity
          };
          productInCart.push(producto);
        }
    
        // Actualizar el arreglo de productos en el carrito utilizando el operador $inc
        await cartModel.updateOne({ _id: idCart }, { "products": productInCart });
    
        return cart;
      } catch (error) {
        console.error('Error en updateQuantity:', error);
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