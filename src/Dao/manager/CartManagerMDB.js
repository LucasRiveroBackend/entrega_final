import cartModel from '../models/cart.model.js';
import ticketModel from '../models/ticket.model.js';
import productModel from '../models/products.model.js';
import ProductManager from '../manager/productManagerMDB.js';
import { v4 as uuidv4 } from "uuid";
const productManager = new ProductManager(productModel);

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
        if (parseInt(cartsMaxId[i].id) > parseInt(maxId)) {
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
      const result = await cartModel.find({ _id: id }).lean();
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
      let productInCart = cart.products;
      const prodIndex = productInCart.findIndex((product) => product.product._id == idProd);

      if (prodIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad en 1
        productInCart[prodIndex].quantity++;
      } else {
        // Si el producto no existe, agregarlo al arreglo
        let producto = {
          product: idProd,
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
      const filteredProducts = productInCart.filter((product) => product.product._id != idProd);
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

  updateManyCart = async (idCart, prod) => {
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
      const prodIndex = productInCart.findIndex((product) => product.product._id == idProd);
      
      if (prodIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad en quantity
        productInCart[prodIndex].quantity = quantity;
      } else {
        // Si el producto no existe, agregarlo al arreglo
        let producto = {
          product: idProd,
          quantity: 1
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

  addPurchase = async (idCart, email) => {
    let totalPrice = 0;
    let totalProductInTicket = 0;
    const outOfStockProducts = []; 
    const carts = await this.getCartsById(idCart);
   
    // si no tengo ningún carrito con ese ID, devuelvo un error
    if (!carts || carts.length === 0) {
      return {
        code: 200,
        status: 'Error',
        message: 'No se ha encontrado un carrito con ese ID'
      };
    }

    // Verificar si hay productos en el carrito antes de recorrerlos
    if (carts[0].products && carts[0].products.length > 0) {
      for (const item of carts[0].products) {
        if (item.quantity <= item.product.stock) {
          const idProduct = item.product._id.toString();
          // calculo el precio
          let unitPrice = 0;
          unitPrice = item.product.price * item.quantity
          totalPrice += unitPrice
    
          // borro el producto del carrito
          await this.deleteProductInCart (idCart, idProduct);
          
          // actualizo el stock
          item.product.stock -= item.quantity;
          await productManager.updateProduct(idProduct, item.product);
          totalProductInTicket += 1;
        } else {
          outOfStockProducts.push(item.product._id);
        }
      }
    }

    // si no tengo productos para agregar en el ticket envio mensaje de error
    if (totalProductInTicket == 0){
      return {
        code: 200,
        status: 'Error',
        message: 'La cantidad de productos del ticket es igual a 0, valide por favor'
      };
    }

    const ticket = await this.addTicket(totalPrice, email);

    if (outOfStockProducts.length > 0) {
      return {
        code: 200,
        status: 'Error',
        message: 'Algunos productos tienen cantidad mayor al stock',
        outOfStockProducts: outOfStockProducts
      };
    }

    return ticket;

  }

   // agrego los ticket
   addTicket = async (amount, email) => {
    try {
       const id = uuidv4();
       let ticket = {
          amount: amount,
          purchaser: email,
          code: id,
       }

       const result = await ticketModel.create(ticket);

       return result;
    } catch (error) {
       console.error('Error en addTicket:', error);
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