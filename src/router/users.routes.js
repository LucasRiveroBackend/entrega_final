import {Router} from "express";
import {changeRole, updateUserDocument, getUsers, deleteInactiveUsers, deleteUserById} from "../controllers/user.controller.js";
import {isAdmin, checkAuthenticated} from "../middlewares/validations.js";
import { uploaderDocument } from "../utils.js";
const router = Router();

router.post("/premium/:uid", changeRole) 

router.put("/:uid/documents",
checkAuthenticated,
uploaderDocument.fields(
    [{name:"identificacion",maxCount:1},
    {name:"domicilio", maxCount:1},
    {name:"estadoDeCuenta", maxCount:1}]), 
updateUserDocument
)

router.get("/", getUsers);

router.delete("/", deleteInactiveUsers);

router.delete("/:uid", deleteUserById)

export {router as usersRouter};