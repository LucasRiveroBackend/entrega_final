import userModel from "../Dao/models/user.model.js";
import moment from "moment";
import { loadUser } from "../middlewares/validations.js";
import { getUser } from "../Dao/dto/user.dto.js";
import { sendInactivityNotification } from "../config/email.js"
export const changeRole = async (req, res) => {
  try {
    const userId = req.params.uid;
    //verificar si el usuario existe en la base de datos
    const user = await userModel.findById(userId);
    if (!req.session.user.rol === "admin"){
      if (user.rol === "usuario" && user.documents.length !== 3) {
        return res.json({
          status: "error",
          message: "el usuario no completo el registro",
        });
      }
    }
    const userRol = user.rol;
    if (userRol === "usuario") {
      user.rol = "premium";
    } else if (userRol === "premium") {
      user.rol = "usuario";
    } else {
      return res.json({
        status: "error",
        message: "no es posible cambiar el role del usuario",
      });
    }
    const resultado = await userModel.updateOne({ _id: user._id }, user);
    await loadUser(user);
    // En lugar de redireccionar, responde con un mensaje JSON
    return res.status(200).send({
      status: 'success',
      user: resultado,
    })
  } catch (error) {
    res.json({
      status: "error",
      message: error,
    });
  }
};

export const updateUserDocument = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);
    const identificacion = req.files["identificacion"]?.[0] || null;
    const domicilio = req.files["domicilio"]?.[0] || null;
    const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
    const docs = [];
    if (identificacion) {
      docs.push({ name: "identificacion", reference: identificacion.filename });
    }
    if (domicilio) {
      docs.push({ name: "domicilio", reference: domicilio.filename });
    }
    if (estadoDeCuenta) {
      docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename });
    }
    if (docs.length === 3) {
      user.status = "completo";
    } else {
      user.status = "incompleto";
    }
    user.documents = docs;
    const userUpdate = await userModel.findByIdAndUpdate(user._id, user);

    res.json({ status: "success", message: "Documentos actualizados" });
  } catch (error) {
    res.json({
      status: "error",
      message: "Hubo un error en la carga de los archivos.",
    });
  }
};

export const getUsers = async (req, res) => {
  const users = await userModel.find();
  let usersDto = [];
  for (let i = 0; i < users.length; i++) {
    const userDto = await new getUser(users[i]);
    usersDto.push(userDto);
  }
  return res.send({
    users: usersDto,
  });
};

export const deleteInactiveUsers = async (req, res) => {
  const users = await userModel.find();
  const hoy = moment();
  let usersDto = [];
  for (let i = 0; i < users.length; i++) {
    const lastConnection = moment(users[i].last_connection);
    if (lastConnection.isValid()) {
      // Calcular la diferencia en días
      const diferenciaEnDias = hoy.diff(lastConnection, "days");
      if (diferenciaEnDias > 2) {
        const userDeleted = await userModel.findByIdAndDelete(users[i]._id);
        if (userDeleted){
            const email = users[i].email;
            await sendInactivityNotification(email);
        }   
      }else{
        usersDto.push(users[i]);
      }
    } else {
    // si no es una fecha valida significa que nunca se logueo
    // entonces lo borro
        const userDeleted = await userModel.findByIdAndDelete(users[i]._id);
        if (userDeleted) {
            const email = users[i].email;
            await sendInactivityNotification(email);
        }
    }
  }
  return res.send({
    users: usersDto,
  });
};

export const deleteUserById = async (req, res) => {
  const userId = req.params.uid;
  //verificar si el usuario existe en la base de datos
  const user = await userModel.findByIdAndDelete(userId);
  if (user){
    return res.status(200).send({
      status: 'success',
      user:user
    })
  }
};