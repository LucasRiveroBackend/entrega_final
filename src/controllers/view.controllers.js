import ProductManager from '../Dao/manager/productManagerMDB.js';
import CartManager from '../Dao/manager/CartManagerMDB.js';
import userModel from '../Dao/models/user.model.js';
import { getUser } from "../Dao/dto/user.dto.js";
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
     limit = 10;
   }
   if (!page || Number.isNaN(page)) {
     page = 1;
   }
   const products = await productManager.getProducts(limit, page, category, stock, sort);
   res.render("products", { productos: products, user: req.session.user });
 }

 export const getUsers = async (req, res) => {
  const users = await userModel.find();
  let usersDto = [];
  for (let i = 0; i < users.length; i++) {
    const userDto = await new getUser(users[i]);
    usersDto.push(userDto);
  }
  res.render("users", { usersDto});
};

export const getCartsByIdUser = async (req, res) => {
  const idCart = req.params.cid;
  const carts = await cartManager.getCartsById(idCart);
  res.render("cart",  { carts} );
}

export const getTicket = async (req, res) => {
  const email = req.params.uemail;
  const tickets = await cartManager.getTicketByEmail(email);
  res.render("ticket", { tickets });
}