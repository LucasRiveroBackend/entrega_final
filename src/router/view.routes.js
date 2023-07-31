
import { Router } from "express";
import { getCartById, getProducts } from '../controllers/view.controllers.js';

const router = Router();

const publicAcces = (req,res,next) =>{
  if(req.session.user) return res.redirect('/products');
  next();
}

const privateAcces = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get("/", privateAcces, async (req, res) => {res.render("chat")});

router.get("/products/:cid", privateAcces, getCartById);

router.get("/products", privateAcces, getProducts); 

router.get('/register', publicAcces, (req,res)=>{res.render('register')})

router.get('/login', publicAcces, (req,res)=>{res.render('login')})

router.get('/profile', privateAcces ,(req,res)=>{
    res.render('profile',{
        user: req.session.user
    })
})

router.get("/forgot-password",(req,res)=>{
  res.render("forgotPassword");
});

router.get("/reset-password",(req,res)=>{
  const token = req.query.token;
  res.render("resetPassword",{token});
});

export default router;