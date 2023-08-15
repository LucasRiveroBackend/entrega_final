export class getUserDto{
   constructor (user){
      //no se devuelve el atributo password del modelo
      this._id = user._id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email = user.email;
      this.age = user.age;
      this.rol = user.rol;
      this.cart = user.cart;
   }
}