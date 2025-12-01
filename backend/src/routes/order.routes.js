import express from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createOrder, getOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getOrders);
router.post('/', createOrder);

export default router;