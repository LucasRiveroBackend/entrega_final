import chai from "chai";
import supertest from "supertest";
import userModel from "../src/Dao/models/user.model.js";
import productModel from "../src/Dao/models/products.model.js";
import { app } from "../src/app.js";
import { createHash, validatePassword } from "../src/utils.js";
import { config } from "./utils/utils.js";
const expect = chai.expect;
const requester = supertest(app);
let firstProduct;
let responseLogin;
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

describe("Test para consulta de productos", () => {
   before(async () => {
      await productModel.deleteMany();
   });

   it("Consulta de productos vacia", async function () {
      const responseGetProducts = await requester.get("/api/products").send();
      expect(responseGetProducts.statusCode).to.be.equal(200);
      expect(responseGetProducts._body.productos).to.be.an('object');
      expect(responseGetProducts._body.productos.products).to.be.an('array');
   });

   it("Registro de productos con faker", async function () {
      const responsePostProducts = await requester.post("/api/products/mockingproducts").send();
      expect(responsePostProducts.statusCode).to.be.equal(200);
   });

   it("Consulta de productos con datos", async function () {
      const responseGetProducts = await requester.get("/api/products").send();
      expect(responseGetProducts.statusCode).to.be.equal(200);
      expect(responseGetProducts._body.productos).to.be.an('object');
      expect(responseGetProducts._body.productos.products).to.be.an('array');
      // verifico que tenga datos
      expect(responseGetProducts._body.productos.products).to.have.length.above(0);
      firstProduct = responseGetProducts._body.productos.products[0];
   });

   it("Validacion estructura de los datos", async function() {
      // valida que el valor de titulo sea string
      expect(firstProduct).to.have.property('title').that.is.a('string');
      expect(firstProduct).to.have.property('description').that.is.a('string');
      // valida que el valor de price sea number
      expect(firstProduct).to.have.property('price').that.is.a('number');
   });
});

describe("Test para proteccion de rutas", () => {
   it("Registro de un usuario", async function () {

      const responseSignup = await requester.post("/api/session/register").send(userMock);

      expect(responseSignup.statusCode).to.be.equal(200);
   });

   it("Logueo de un usuario", async function () { 
      responseLogin = await requester.post("/api/session/login").send({email: userMock.email, password: config.passwordOrigin} );
      id = responseLogin._body.payload._id;
      expect(responseLogin.statusCode).to.be.equal(200);
   });

   it("Usuario con rol 'usuario' intenta cargar productos", async function () { 
      const responseProduct = await requester.post("/api/products").send(product);
      expect(responseProduct.statusCode).to.be.equal(400);
      expect(responseProduct._body.status).to.be.equal('error');
      expect(responseProduct._body.message).to.be.equal('Operacion no permitida para el tipo de usuario');
   });

   it("Cambio rol del usuario", async function () { 
      const responseUpdateUser = await requester.put(`/api/users/premium/${id}`).send();
      expect(responseUpdateUser.statusCode).to.be.equal(200);
   });

   it("Usuario con rol 'premium' intenta cargar productos", async function () {
      product.owner = responseLogin._body.payload._id;
      const responseProduct = await requester.post("/api/products").send(product);
      expect(responseProduct.statusCode).to.be.equal(200);
      expect(responseProduct._body).to.be.an('object');
   });

   after(async () => {
    // Eliminar los usuarios creados aquí
      await userModel.deleteMany();
    await productModel.deleteMany();
   });
})