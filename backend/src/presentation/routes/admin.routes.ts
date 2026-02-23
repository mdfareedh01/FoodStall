import express from 'express';
import { ProductService } from '../../application/services/product.service.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import { OrderRepository } from '../../infrastructure/repositories/order.repository.js';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';

const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();
const productService = new ProductService(productRepo);

export const adminRoutes = express.Router();

const AdminProductSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    image: z.string().url(),
    isVeg: z.boolean(),
    category: z.string().optional(),
    isSpecial: z.boolean().optional(),
    origin: z.enum(['Farm', 'Homemade', 'Standard']).optional(),
    ingredients: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

const mapProduct = (p: any) => {
    try {
        return {
            ...p,
            ingredients: typeof p.ingredients === 'string' ? JSON.parse(p.ingredients) : (Array.isArray(p.ingredients) ? p.ingredients : []),
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (Array.isArray(p.tags) ? p.tags : []),
        };
    } catch (e) {
        console.error('Error parsing product JSON fields:', e);
        return { ...p, ingredients: [], tags: [] };
    }
};

adminRoutes.post('/products', validate({ body: AdminProductSchema }), async (req, res) => {
    try {
        const data = req.body;
        const product = await productService.addProduct({
            ...data,
            ingredients: JSON.stringify(data.ingredients || []),
            tags: JSON.stringify(data.tags || [])
        });
        res.status(201).json(mapProduct(product));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

adminRoutes.put('/products/:id', validate({ body: AdminProductSchema.partial() }), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const updateData: any = { ...data };
        if (data.ingredients) updateData.ingredients = JSON.stringify(data.ingredients);
        if (data.tags) updateData.tags = JSON.stringify(data.tags);

        const product = await productService.updateProduct(id, updateData);
        res.json(mapProduct(product));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

adminRoutes.delete('/products/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await productService.removeProduct(id);
        res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

adminRoutes.get('/orders', async (req, res) => {
    try {
        const orders = await orderRepo.findAllHydrated();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

adminRoutes.patch('/orders/:id/status', validate({ body: z.object({ status: z.enum(['pending', 'completed', 'cancelled']) }) }), async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const order = await orderRepo.updateStatus(id, status);
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
