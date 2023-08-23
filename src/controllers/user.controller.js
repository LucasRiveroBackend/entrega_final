import userModel from '../Dao/models/user.model.js';
import {loadUser} from '../middlewares/validations.js';
export const changeRole = async (req,res)=>{
   try {
       const userId = req.params.uid;
       //verificar si el usuario existe en la base de datos
       const user = await userModel.findById(userId);
       if(user.rol === "usuario" && user.documents.length !== 3){
         return res.json({status:"error", message:"el usuario no completo el registro"});
       }
       const userRol = user.rol;
       if(userRol === "usuario"){
           user.rol = "premium"
       } else if(userRol === "premium"){
           user.rol = "usuario"
       } else {
           return res.json({status:"error", message:"no es posible cambiar el role del usuario"});
       }
       await userModel.updateOne({_id:user._id},user);
       await loadUser(user);
       res.send({status:"success", message:"rol modificado"});
   } catch (error) {
       res.json({status:"error", message:"hubo un error al cambiar el rol del usuario"})
   }
};

export const updateUserDocument = async (req,res) =>{
    try {
        const userId = req.params.uid
        const user = await userModel.findById(userId);
        const identificacion = req.files['identificacion']?.[0] || null;
        const domicilio = req.files['domicilio']?.[0] || null;
        const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
        const docs = [];
        if(identificacion){
            docs.push({name:"identificacion", reference:identificacion.filename})
        }
        if(domicilio){
            docs.push({name:"domicilio", reference:domicilio.filename})
        }
        if(estadoDeCuenta){
            docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename})
        }
        if(docs.length ===3){
            user.status = "completo"
        }else{
            user.status = "incompleto"
        }
        user.documents = docs;
        const userUpdate = await userModel.findByIdAndUpdate(user._id,user)

        res.json({status:"success", message:"Documentos actualizados"})

    } catch (error) {
        res.json({status:"error", message: "Hubo un error en la carga de los archivos."})
    }
}