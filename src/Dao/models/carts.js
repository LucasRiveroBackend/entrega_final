import mongoose from 'mongoose';

const collection = 'carts';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  products: {
    type: [
      {
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"product"
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