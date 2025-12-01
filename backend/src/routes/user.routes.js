import express from 'express';
import { getUser, userLogin, userRegister } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/', authMiddleware, getUser);
router.post('/register', userRegister);
router.post('/login', userLogin);

export default router;