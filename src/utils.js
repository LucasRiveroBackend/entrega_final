import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {config} from "./config/config.js";
import multer from "multer";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);  
} 

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const generateEmailToken = (email, expireTime)=>{
   const token = jwt.sign({email},config.gmail.emailToken, {expiresIn:expireTime})
   return token
}
export const verifyEmailToken = (token) =>{
   try {
       const info = jwt.verify(token,config.gmail.emailToken);
       return info.email;
   } catch (error) {
       console.log(error.message)
       return null
   }
}

//configuracion para guardar imagenes de usuarios

const validFields = (body) => {
    const {name, email, password} = body;
    if(!name || !email || !password){
        return false;
    }else{
        return true;
    }
};

//filtro para validar los campos de cargar la imagen
const multerFilterProfile = (req,file,cb)=>{
    const isValid = validFields(req.body);
    if(isValid){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const profileStorage = multer.diskStorage({
    //donde guardo los archivos
    destination: function(req,file,cb) {
      cb(null,path.join(__dirname,"/multer/user/profiles"))  
    },
    
    //el nombre del archivo que estamos guardando
    filename: function (req,file,cb) {
        cb(null,`${req.body.email}-perfil-${file.originalname}`)
    }
})
//Creamos el uploader de multer
export const uploaderProfile = multer({storage:profileStorage })

//Configuracion para guardar documentos de los usuarios

const documentStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/user/documents"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.user.email}-document-${file.originalname}`);
    }
})

//creamos el uploader
export const uploaderDocument = multer({storage:documentStorage});

//configuracion para guardar imagenes de productos
const productStorage= multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/products/images"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.body.code}-image-${file.originalname}`);
    }
})

export const uploaderProduct = multer({storage:productStorage})

export default __dirname;