import MessageManager  from "../Dao/manager/MessageManagerMDB.js";
const messageManager = new MessageManager();

export const getMessage = async (req, res) => {
   const message = req.body;
   const resultado = await messageManager.addMessage(message);
 
   if(resultado){
      return res.send({
         message:resultado,
      })
   }
 }