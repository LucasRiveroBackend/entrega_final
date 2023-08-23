import mongoose from "mongoose";

const collection = "User";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  rol: {
    type: String,
    enum: ["usuario", "admin", "premium"],
    default: "usuario",
  },
  cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    require: true,
    enums: ["completo", "incompleto", "pendiente"],
    default: "pendiente",
  },
  avatar: {
    type: String,
    default: "",
  },
});

const userModel = mongoose.model(collection, schema);

export default userModel;
