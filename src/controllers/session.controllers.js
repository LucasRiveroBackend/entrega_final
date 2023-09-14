import moment from 'moment-timezone';
import userModel from '../Dao/models/user.model.js';
import { loadUser } from '../middlewares/validations.js';
import { getUserDto } from "../Dao/dto/user.dto.js";
import { createHash, validatePassword, generateEmailToken, verifyEmailToken } from "../utils.js";
import { sendRecoveryPass } from "../config/email.js"
import * as logger from "../config/logger.js";
export const register = async (req, res) => {
  res.redirect('/products');
}

export const failregister = async (req, res) => {
  req.logger.warn("!Fallo en el registro!");
  res.send({ error: 'Error en el registro' })
}

export const login = async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });
  const cartId = req.body.cartId;
  const buenosAiresTimezoneOffset = -180;
  const now = new Date();
  const buenosAiresTime = new Date(now.getTime() + buenosAiresTimezoneOffset * 60000);
  req.session.user = {
    id: req.user._id,
    name: req.user.firs_name,
    name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.rol,
    cart: cartId,
    last_connection: buenosAiresTime
  }

  const users = await userModel.findById(req.session.user.id);
  await loadUser(users);
  const user = users
  if (user) {
    const cartInUsers = user.cart;
    const cartExists = cartInUsers.some((cart) => cart._id == cartId);
    if (cartExists) {
      logger.infoLogger.info('Ya existe');
    } else {
      const cart = {
        _id: cartId
      };
      cartInUsers.push(cart);
      await userModel.updateOne({ _id: req.session.user.id }, { "cart": cartInUsers });
    }
  } else {
    req.logger.warn("Usuario no encontrado");
  }
  // actualizo la ultima fecha de logueo
  await userModel.updateOne({ _id: req.session.user.id }, { "last_connection": buenosAiresTime });
  const userDto = await new getUserDto(user);
  const update = await userModel.findById(req.session.user.id).populate('cart.cart');
  res.send({ status: "success", payload: userDto, message: "Primer logueo!!" })
}

export const logout = async (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.id;
    const buenosAiresTimezoneOffset = -180;
    const now = new Date();
    // Convertir a milisegundos
    const buenosAiresTime = new Date(now.getTime() + buenosAiresTimezoneOffset * 60000); 

    // Realizar actualización de last_connection al cerrar sesión
    await userModel.updateOne({ _id: userId }, { "last_connection": buenosAiresTime });
  }
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //verifico si existe
    const user = await userModel.findOne({ email: email })
    if (!user) {
      return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
    }
    const token = generateEmailToken(email, 3 * 60);
    await sendRecoveryPass(email, token);
    res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver  <a href='/login'>al login</a>")
  } catch (error) {
    logger.infoLogger.info('Error al forgotPassword');
    return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;
    //validamos el token
    const validEmail = verifyEmailToken(token)
    if (!validEmail) {
      return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgot-password">Nuevo enlace</a>.`)
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.send("El usuario no esta registrado.")
    }
    if (validatePassword(newPassword, user)) {
      return res.send("No puedes usar la misma contraseña.")
    }
    const userData = {
      ...user._doc,
      password: createHash(newPassword)
    };
    const userUpdate = await userModel.findOneAndUpdate({ email: email }, userData);
    res.render("login", { message: "contraseña actualizada" })

  } catch (error) {
    res.send(error.message)
  }
}