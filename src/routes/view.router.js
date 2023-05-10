
import { Router } from "express";
import ProductosManager from "../Manager/productManager.js";

const router = Router();
const manager = new ProductosManager();

router.get("/", async (req, res) => {
  res.render("chat");
});

export default router;