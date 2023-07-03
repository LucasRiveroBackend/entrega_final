let userType;
let userEmail;
export const loadUser = (user) => {
   userType = user.rol;
   userEmail = user.email;
   console.log('userType: ', user)
};

export const isAdmin = (req, res, next) => {
   if (userType !== 'admin' || userType === undefined) {
      res.status(400).json({ status: "error", message: "Operacion no permitida" });
   } else {
      next();
   }
};

export const isUser = (req, res, next) => {
   if (userType !== 'usuario' || userType === undefined) {
      res.status(400).json({ status: "error", message: "Operacion no permitida" });
   } else {
      next();
   }
};