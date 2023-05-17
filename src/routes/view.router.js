
import { Router } from "express";

import ProductManager from '../Manager/productManagerMDB.js';
const router = Router();
const productManager = new ProductManager();
import CartManager from '../Manager/CartManagerMDB.js';
const cartManager = new CartManager();
router.get("/", async (req, res) => {
  res.render("chat");
});

router.get("/products/:cid", async (req, res) => {
  const idCart = req.params.cid;
  const products = await cartManager.getCartsById(idCart);
  console.log('products: ', products)
  res.render("products", { products });
});

router.get("/products", async (req, res) => {
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
  res.render("products", { productos: products });
});
export default router;