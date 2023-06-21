import { Router } from "express";
import {getMessage} from '../controllers/message.controllers.js';

const router = Router();

router.get("/", getMessage);

export default router;