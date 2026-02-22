import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ProductService } from '../../application/services/product.service.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';

const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);

export const productRoutes = new OpenAPIHono();

const ProductSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    title: z.string().openapi({ example: 'Fresh Tomato' }),
    image: z.string().openapi({ example: 'https://example.com/tomato.jpg' }),
    price: z.number().openapi({ example: 10.99 }),
    isVeg: z.boolean().openapi({ example: true }),
    ingredients: z.array(z.string()).openapi({ example: ['Tomato', 'Water'] }),
    description: z.string().openapi({ example: 'Fresh from the farm' }),
    category: z.string().optional().openapi({ example: 'Vegetables' }),
    isSpecial: z.boolean().optional().openapi({ example: false }),
    origin: z.enum(['Farm', 'Homemade', 'Standard']).optional().openapi({ example: 'Farm' }),
    tags: z.array(z.string()).optional().openapi({ example: ['Fresh', 'Organic'] }),
}).openapi('Product');

const filterSchema = z.object({
    category: z.string().optional(),
    isSpecial: z.string().transform(v => v === 'true').optional(),
    origin: z.enum(['Farm', 'Homemade', 'Standard']).optional(),
    search: z.string().optional(),
});

const getProductsRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: filterSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(ProductSchema),
                },
            },
            description: 'List of products',
        },
    },
});

const getProductByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: z.object({
            id: z.string().openapi({ example: '1' }),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ProductSchema,
                },
            },
            description: 'The product detail',
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({ error: z.string() }),
                },
            },
            description: 'Product not found',
        },
    },
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

productRoutes.openapi(getProductsRoute, async (c) => {
    const filter = c.req.valid('query');
    const products = await productService.getCatalog(filter as any);
    return c.json(products.map(mapProduct), 200);
});

productRoutes.openapi(getProductByIdRoute, async (c) => {
    const id = Number(c.req.param('id'));
    const product = await productService.getProduct(id);
    if (!product) return c.json({ error: 'Product not found' }, 404);
    return c.json(mapProduct(product), 200);
});
