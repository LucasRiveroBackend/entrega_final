import { Router } from 'express';
import {getLogs} from '../controllers/test.controllers.js';

const router = Router();

router.get('/loggerTest', getLogs);

export default router;