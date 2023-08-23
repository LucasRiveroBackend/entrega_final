import chai from "chai";
import supertest from "supertest";
import userModel from "../src/Dao/models/user.model.js";
import productModel from "../src/Dao/models/products.model.js";
import { app } from "../src/app.js";
import { createHash, validatePassword } from "../src/utils.js";
import { config } from "./utils/utils.js";
const expect = chai.expect;
const requester = supertest(app);

let respuestaLogin;
let id;
const userMock = {
   first_name: "usuarioMock",
   last_name: "apellidoMock",
   email: config.userTest,
   password: config.passwordLogin
}
const adminMock = {
   first_name: "usuarioMock",
   last_name: "apellidoMock",
   email: config.adminTest,
   password: config.passwordLogin,
}
let product = {
   title: "productMock",
   description: "productMock",
   price: 500,
   thumbnail: "productMock",
   code: "productMock",
   stock: 100,
   id: 100,
   category: "productMock",
   status: false,
   owner: id
}
describe("Test para creacion y validacion de hash del password", () => {
   it("Registro de un usuario", async function () {

      const responseSignup = await requester.post("/api/session/register").send(userMock);

      expect(responseSignup.statusCode).to.be.equal(200);
   })

   it("El servicio debe realizar un hasheo efectivo de la contraseña el resultado != a la original.", async function () {
      const efectiveHash = /(?=[A-Za-z0-9@#$%/^.,{}&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g;
      const passwordHash = await createHash(config.passwordLogin);
      expect(efectiveHash.test(passwordHash)).to.be.equal(true);
   })

   it("El hasheo realizado debe poder compararse de manera efectiva con la contraseña original, el resultado tiene que ser true", async function () {
      const passwordHash = await createHash(config.passwordLogin);
      const mockUser = {
         email: "pepe@mail.com",
         password: passwordHash
      }
      const result = await validatePassword(config.passwordLogin, mockUser);

      expect(result).to.be.equal(true)
   })
   it("Si la contraseña hasheada se altera, debe fallar en la comparación de la contraseña original.", async function () {
      const passwordHash = await createHash(config.passwordLogin);
      const mockUser = {
         email: config.userTest,
         password: passwordHash + "ga12w"
      }
      const result = await validatePassword(config.passwordLogin, mockUser);

      expect(result).to.be.equal(false)
   })
})

describe("Test para autenticacion de usuarios y validacion de datos", () => {
   it("Logueo de un usuario con pass incorrecto", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({email: adminMock.email, password: config.passIncorrect} );
      expect(responseLogin.statusCode).to.be.equal(302);
   });

   it("Logueo de un usuario sin password", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({email: adminMock.email} );
      expect(responseLogin.statusCode).to.be.equal(302);
   });

   it("Logueo de un usuario con email incorrecto", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({email: config.userIncorrect, password: config.passwordOrigin} );
      expect(responseLogin.statusCode).to.be.equal(302);
   });

   it("Logueo de un usuario sin email", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({password: config.passwordOrigin} );
      expect(responseLogin.statusCode).to.be.equal(302);
   });
})

describe("Test para autenticacion de usuarios y cambio de roles", () => {
   it("Logueo de un usuario", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({email: userMock.email, password: config.passwordOrigin} );
      id = responseLogin._body.payload._id;
      expect(responseLogin.statusCode).to.be.equal(200);
   });

   it("Registro de un usuario", async function () {
      const responseSignup = await requester.post("/api/session/register").send(adminMock);
      expect(responseSignup.statusCode).to.be.equal(200);
   })

   it("Logueo de un usuario", async function () { 
      const responseLogin = await requester.post("/api/session/login").send({email: adminMock.email, password: config.passwordOrigin} );
      id = responseLogin._body.payload._id;
      respuestaLogin = responseLogin
      expect(responseLogin.statusCode).to.be.equal(200);
   });

   it("Cambio rol del usuario", async function () { 
      const responseUpdateUser = await requester.put(`/api/users/premium/${id}`).send();
      expect(responseUpdateUser.statusCode).to.be.equal(200);
   });

   after(async () => {
      await userModel.deleteMany();
   });
})