let userType;
let userEmail;
export const loadUser = (user) => {
   userType = user.rol;
   userEmail = user.email;
};

export const isAdmin = (req, res, next) => {
   if (userType === 'admin' || userType === 'premium') {
      next();
   } else {
      res.status(400).send({ status: "error", message: "Operacion no permitida para el tipo de usuario" });
   }
};

export const isUser = (req, res, next) => {
   if (userType !== 'usuario' || userType === undefined) {
      res.status(400).send({ status: "error", message: "Operacion no permitida para el tipo de usuario" });
   } else {
      next();
   }
};
