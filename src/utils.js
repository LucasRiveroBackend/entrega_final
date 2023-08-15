import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {config} from "./config/config.js";


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

export default __dirname;