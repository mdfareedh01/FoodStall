import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ProductService } from '../../application/services/product.service.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import { AuthService } from '../../application/services/auth.service.js';
import { OrderRepository } from '../../infrastructure/repositories/order.repository.js';

const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();
const productService = new ProductService(productRepo);
const authService = new AuthService();

export const adminRoutes = new OpenAPIHono();

const AdminProductSchema = z.object({
    title: z.string().min(1).openapi({ example: 'New Food Item' }),
    description: z.string().min(1).openapi({ example: 'Delicious new item' }),
    price: z.number().positive().openapi({ example: 12.99 }),
    image: z.string().url().openapi({ example: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }),
    isVeg: z.boolean().openapi({ example: true }),
    category: z.string().optional().openapi({ example: 'Lunch' }),
    isSpecial: z.boolean().optional().openapi({ example: false }),
    origin: z.enum(['Farm', 'Homemade', 'Standard']).optional().openapi({ example: 'Farm' }),
    ingredients: z.array(z.string()).optional().openapi({ example: ['Fresh Tomato', 'Basil'] }),
    tags: z.array(z.string()).optional().openapi({ example: ['New', 'Popular'] }),
}).openapi('AdminProductRequest');

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

// Admin Role Middleware (DISABLED FOR DEV)
adminRoutes.use('*', async (c, next) => {
    /* 
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const token = authHeader.split(' ')[1];
    const payload = await authService.verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return c.json({ error: 'Forbidden: Admin access only' }, 403);
    }
    */

    await next();
});

const createProductRoute = createRoute({
    method: 'post',
    path: '/products',
    security: [{ Bearer: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: AdminProductSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({ id: z.number() }).passthrough(),
                },
            },
            description: 'Product created',
        },
    },
});

const updateProductRoute = createRoute({
    method: 'put',
    path: '/products/{id}',
    security: [{ Bearer: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({ example: '1' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: AdminProductSchema.partial(),
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({ id: z.number() }).passthrough(),
                },
            },
            description: 'Product updated',
        },
    },
});

const deleteProductRoute = createRoute({
    method: 'delete',
    path: '/products/{id}',
    security: [{ Bearer: [] }],
    request: {
        params: z.object({
            id: z.string().openapi({ example: '1' }),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({ message: z.string().openapi({ example: 'Deleted successfully' }) }),
                },
            },
            description: 'Product deleted',
        },
    },
});

adminRoutes.openapi(createProductRoute, async (c) => {
    const data = c.req.valid('json');
    const product = await productService.addProduct({
        ...data,
        ingredients: JSON.stringify(data.ingredients || []),
        tags: JSON.stringify(data.tags || [])
    });
    return c.json(mapProduct(product), 201);
});

adminRoutes.openapi(updateProductRoute, async (c) => {
    const id = Number(c.req.param('id'));
    const data = c.req.valid('json');

    const updateData: any = { ...data };
    if (data.ingredients) updateData.ingredients = JSON.stringify(data.ingredients);
    if (data.tags) updateData.tags = JSON.stringify(data.tags);

    const product = await productService.updateProduct(id, updateData);
    return c.json(mapProduct(product), 200);
});

const getOrdersRoute = createRoute({
    method: 'get',
    path: '/orders',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(z.any()),
                },
            },
            description: 'List of all orders',
        },
    },
});

const updateOrderStatusRoute = createRoute({
    method: 'patch',
    path: '/orders/{id}/status',
    request: {
        params: z.object({
            id: z.string().openapi({ example: 'ORD-1234' }),
        }),
        body: {
            content: {
                'application/json': {
                    schema: z.object({
                        status: z.enum(['pending', 'completed', 'cancelled']),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Order status updated',
            content: {
                'application/json': {
                    schema: z.any(),
                },
            },
        },
    },
});

adminRoutes.openapi(getOrdersRoute, async (c) => {
    const orders = await orderRepo.findAllHydrated();
    return c.json(orders, 200);
});

adminRoutes.openapi(updateOrderStatusRoute, async (c) => {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const order = await orderRepo.updateStatus(id, status);
    return c.json(order, 200);
});

adminRoutes.openapi(deleteProductRoute, async (c) => {
    const id = Number(c.req.param('id'));
    await productService.removeProduct(id);
    return c.json({ message: 'Deleted successfully' }, 200);
});
