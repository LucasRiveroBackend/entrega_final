
import { Router } from "express";
import ProductManager from '../Manager/productManagerMDB.js';
const router = Router();
const productManager = new ProductManager();
import CartManager from '../Manager/CartManagerMDB.js';
const cartManager = new CartManager();

const publicAcces = (req,res,next) =>{
  if(req.session.user) return res.redirect('/products');
  next();
}

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get("/", privateAcces, async (req, res) => {
  res.render("chat");
});

router.get("/products/:cid", privateAcces,  async (req, res) => {
  const idCart = req.params.cid;
  const carts = await cartManager.getCartsById(idCart);
  res.render("productsById",  { carts} );
});

router.get("/products", privateAcces, async (req, res) => {
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
  console.log('req.session.user: ', req.session.user) 
  res.render("products", { productos: products, user: req.session.user });
}); 

router.get('/register', publicAcces, (req,res)=>{
    res.render('register')
})

router.get('/login', publicAcces, (req,res)=>{
    res.render('login')
})

router.get('/profile', privateAcces ,(req,res)=>{
    res.render('profile',{
        user: req.session.user
    })
})

router.get('/resetPassword', (req,res)=>{
  res.render('resetPassword');
})

export default router;