import {Router} from "express";
import {changeRole} from "../controllers/user.controller.js";

const router = Router();

router.put("/premium/:uid", changeRole) 


export {router as usersRouter};