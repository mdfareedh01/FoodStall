import express from 'express';
import { ProductService } from '../../application/services/product.service.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';

const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);

export const productRoutes = express.Router();

const filterSchema = z.object({
    category: z.string().optional(),
    isSpecial: z.string().transform(v => v === 'true').optional(),
    origin: z.enum(['Farm', 'Homemade', 'Standard']).optional(),
    search: z.string().optional(),
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

productRoutes.get('/', validate({ query: filterSchema }), async (req, res) => {
    try {
        const products = await productService.getCatalog(req.query as any);
        res.json(products.map(mapProduct));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

productRoutes.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await productService.getProduct(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(mapProduct(product));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
