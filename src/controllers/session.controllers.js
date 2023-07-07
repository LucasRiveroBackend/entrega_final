import userModel from '../Dao/models/user.model.js';
import { loadUser } from '../middlewares/validations.js';
import { getUserDto } from "../Dao/dto/user.dto.js";



export const register = async (req, res) =>{
  res.send({status:"succes", message:"User registered"});
}

export const failregister = async (req, res) => {
  console.log('Fallo en el registro');
  res.send({ error: 'Error en el registro' })
}

export const login = async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });
  const cartId = req.body.cartId;
  req.session.user = {
    id: req.user._id,
    name: req.user.firs_name,
    name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.rol,
    cart: cartId
  }

  const users = await userModel.findById(req.session.user.id);
  await loadUser(users);
  const user = users
  if (user) {
    const cartInUsers = user.cart;
    const cartExists = cartInUsers.some((cart) => cart._id == cartId);
    if (cartExists) {
      console.log('Ya existe');
    } else {
      const cart = {
        _id: cartId
      };
      cartInUsers.push(cart);
      await userModel.updateOne({ _id: req.session.user.id }, { "cart": cartInUsers });
    }
  } else {
    console.log('Usuario no encontrado');
  }
  const userDto = await new getUserDto(user);
  const update = await userModel.findById(req.session.user.id).populate('cart.cart');
  res.send({ status: "success", payload: userDto, message: "Primer logueo!!" })
}

export const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" })
    res.redirect('/login');
  })
}

export const githubCallback = async (req, res) => {
  const first_name = req.user[0].first_name.replace(/"/g, '');
  const email = req.user[0].email.replace(/"/g, '');
  req.session.user = {
    name: first_name,
    email: email,
    rol: 'user'
  }
  res.redirect('/products')
}