import { Router } from "express";
import MessageManager from '../Manager/MessageManagerMDB.js';
const messageManager = new MessageManager();
const router = Router();

router.get("/", async (req, res) => {
  const message = req.body;
  const resultado = await messageManager.addMessage(message);
  console.log('llego')
  if(resultado){
     return res.send({
        message:resultado,
     })
  }
});

export default router;