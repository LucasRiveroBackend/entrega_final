import messageModel from '../models/message.model.js';

export default class MessageManager {

   constructor() {
      this.messages = [];
   }

   addMessage = async (messageInfo) => {
      try {
         const {user, message} = messageInfo

         let messages = {
            user: user,
            message: message
         }

         const result = await messageModel.create(messages);

         return result;
      } catch (error) {
         console.error('Error en messageModel:', error);
         throw error;
      }
   }

   getMessage = async () => {
      try {
         const result = await messageModel.find();
         return result;
      } catch (error) {
         console.error('Error en messageModel:', error);
         throw error;
      }
   }
}