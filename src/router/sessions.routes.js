import { Router } from 'express';
import {register, failregister, login, logout, githubCallback, forgotPassword, resetPassword} from '../controllers/session.controllers.js';
import passport from "passport";
const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister'}), register)

router.get('/failregister', failregister)

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), login)

router.get('/logout', logout)

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), githubCallback)

router.post("/forgot-password",forgotPassword);

router.post("/reset-password", resetPassword);

export default router;