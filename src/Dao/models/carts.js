import mongoose from 'mongoose';

const collection = 'Carts';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  products: {
    type: [
      {
        idProduct: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number
        }
      }
    ],
    default: []
  }
});


const cartModel = mongoose.model(collection, schema);

export default cartModel;