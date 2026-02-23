import express from 'express';
import { OrderService } from '../../application/services/order.service.js';
import { OrderRepository } from '../../infrastructure/repositories/order.repository.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';

import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();
const userRepo = new UserRepository();
const orderService = new OrderService(orderRepo, productRepo, userRepo);

export const orderRoutes = express.Router();

const createOrderSchema = z.object({
    customerPhone: z.string().min(10),
    items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().positive(),
    })).min(1),
});

orderRoutes.post('/', validate({ body: createOrderSchema }), async (req, res) => {
    try {
        const order = await orderService.placeOrder('anonymous', req.body);
        res.status(201).json(order);
    } catch (error: any) {
        console.error('[OrderRoutes] Error placing order:', error);
        res.status(400).json({ error: error.message });
    }
});

orderRoutes.get('/me', async (req, res) => {
    try {
        const phone = req.query.phone as string;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const orders = await orderService.getUserOrders(phone);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
