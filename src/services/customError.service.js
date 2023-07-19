import * as logger from "../config/logger.js";
export class CustomError{
   static createError({name="Error",cause,message,errorCode}){
       const error = new Error(message,{cause});
       error.name = name;
       error.code = errorCode;
       logger.infoLogger.info("error", error.cause);
       return error.cause
       
   }
}