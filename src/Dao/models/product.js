import mongoose from 'mongoose';

const collection = 'Products';

const schema = new mongoose.Schema({
   title: {
      type: String,
      require: true
   },
   description: {
      type: String,
      require: true
   },
   price: {
      type: Number,
      require: true
   },
   thumbnail: {
      type: String,
      require: false
   },
   code: {
      type: String,
      require: true
   },
   stock: {
      type: Number,
      require: true
   },
   id: {
      type: Number,
      require: true
   },
   category: {
      type: String,
      require: true
   },
   status: {
      type: Boolean,
      require: true
   },
})

const productModel = mongoose.model(collection, schema);
export default productModel;