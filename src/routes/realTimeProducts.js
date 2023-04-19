import { Router } from "express";
import ProductsManagar from "../Manager/productManager.js";

const router = Router();
const manager = new ProductsManagar();

router.get("/", async (req, res) => {
  const productos = await manager.getProducts();
  res.render("realTimeProducts", { productos: productos });
});

export default router;
