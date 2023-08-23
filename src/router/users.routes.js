import {Router} from "express";
import {changeRole, updateUserDocument} from "../controllers/user.controller.js";
import {isAdmin, checkAuthenticated} from "../middlewares/validations.js";
import { uploaderDocument } from "../utils.js";
const router = Router();

router.put("/premium/:uid", changeRole) 

router.put("/:uid/documents",
checkAuthenticated,
uploaderDocument.fields(
    [{name:"identificacion",maxCount:1},
    {name:"domicilio", maxCount:1},
    {name:"estadoDeCuenta", maxCount:1}]), 
updateUserDocument
)

export {router as usersRouter};