import mongoose from 'mongoose';

const collection = 'Carts';

const schema = new mongoose.Schema({
    id:{
        type:Number,
        require:true
    },
    products:{
        type: [
         {
            idProduct:{
               type: Number,
               default: 0
            },
            quantity:{
               type: Number,
               default: 0
            }
         }
        ],
        default: []
    },
})

const cartModel = mongoose.model(collection,schema);
export default cartModel;