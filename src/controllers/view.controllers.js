import ProductManager from '../Dao/manager/productManagerMDB.js';
import CartManager from '../Dao/manager/CartManagerMDB.js';
const cartManager = new CartManager();
const productManager = new ProductManager();

export const getCartById = async (req, res) => {
   const idCart = req.params.cid;
   const carts = await cartManager.getCartsById(idCart);
   res.render("productsById",  { carts} );
 }

export const getProducts = async (req, res) => {
   const limitString = req.query.limit;
   const pageString = req.query.page;
   const category = req.query.category;
   const stockString = req.query.stock;
   const sort = req.query.sort
 
   let limit = parseInt(limitString);
   let page = parseInt(pageString);
   const stock = parseInt(stockString);
 
   if (!limit || Number.isNaN(limit)) {
     limit = 1;
   }
   if (!page || Number.isNaN(page)) {
     page = 1;
   }
   const products = await productManager.getProducts(limit, page, category, stock, sort);
   res.render("products", { productos: products, user: req.session.user });
 }