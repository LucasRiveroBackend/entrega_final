import chai from "chai";
import supertest from "supertest";
import userModel from "../src/Dao/models/user.model.js";
import productModel from "../src/Dao/models/products.model.js";
import cartModel from "../src/Dao/models/cart.model.js";
import { app } from "../src/app.js";
import { createHash, validatePassword } from "../src/utils.js";
import { config } from "./utils/utils.js";
const expect = chai.expect;
const requester = supertest(app);
let firstProduct;
let responseLogin;
let id;
let idCart;
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
let newProduct;
let newCartId;

describe("Test para consulta de carritos", () => {
   before(async () => {
      await userModel.deleteMany();
      await productModel.deleteMany();
      await cartModel.deleteMany();
   });

   it("Registro de un usuario", async function () {
      const responseSignup = await requester.post("/api/session/register").send(userMock);
      expect(responseSignup.statusCode).to.be.equal(200);
   });

   it("Crear un nuevo carrito para asignar al usuario logueado", async function (){
      const responseCreateCart = await requester.post("/api/carts").send();
      newCartId = responseCreateCart._body.cart._id;
      expect(responseCreateCart.statusCode).to.be.equal(200);
   });

   it("Logueo de un usuario", async function () {
      responseLogin = await requester.post("/api/session/login").send({email: userMock.email, password: config.passwordOrigin, cartId: newCartId} );
      id = responseLogin._body.payload._id;
      idCart = JSON.stringify(responseLogin._body.payload.cart)
      expect(responseLogin.statusCode).to.be.equal(200);
   });

   it("Cambio rol del usuario", async function () { 
      const responseUpdateUser = await requester.put(`/api/users/premium/${id}`).send();
      expect(responseUpdateUser.statusCode).to.be.equal(200);
   });

   it("Usuario con rol 'premium' carga producto", async function () {
      product.owner = responseLogin._body.payload._id;
      const responseProduct = await requester.post("/api/products").send(product);
      expect(responseProduct.statusCode).to.be.equal(200);
      expect(responseProduct._body).to.be.an('object');
      newProduct = responseProduct._body;
   });

   it("Cambio rol del usuario", async function () { 
      const responseUpdateUser = await requester.put(`/api/users/premium/${id}`).send();
      expect(responseUpdateUser.statusCode).to.be.equal(200);
   });

   it("Usuario con rol 'usuario' intenta cargar productos al carrito", async function () {
      const pid = newProduct.producto._id;
      const cid = newCartId;
      const responseProduct = await requester.post(`/api/carts/${cid}/product/${pid}`).send();
      expect(responseProduct.statusCode).to.be.equal(200);
   });
});