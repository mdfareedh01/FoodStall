import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { OrderService } from '../../application/services/order.service.js';
import { OrderRepository } from '../../infrastructure/repositories/order.repository.js';
import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import { AuthService } from '../../application/services/auth.service.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

const orderRepo = new OrderRepository();
const productRepo = new ProductRepository();
const userRepo = new UserRepository();
const orderService = new OrderService(orderRepo, productRepo, userRepo);
const authService = new AuthService();

type Env = {
    Variables: {
        userId: string;
    };
};

export const orderRoutes = new OpenAPIHono<Env>();

const mapProduct = (p: any) => {
    try {
        return {
            ...p,
            ingredients: typeof p.ingredients === 'string' ? JSON.parse(p.ingredients) : (Array.isArray(p.ingredients) ? p.ingredients : []),
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (Array.isArray(p.tags) ? p.tags : []),
        };
    } catch (e) {
        console.error('Error parsing order product JSON fields:', e);
        return { ...p, ingredients: [], tags: [] };
    }
};

const mapOrder = (o: any) => {
    if (!o) return o;
    return {
        ...o,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
        items: o.items?.map((item: any) => ({
            ...item,
            product: mapProduct(item.product)
        }))
    };
};

const orderSchema = z.object({
    customerPhone: z.string().min(10).max(15).regex(/^[0-9+\-\s]+$/, 'Invalid phone number format').openapi({ example: '1234567890' }),
    items: z.array(z.object({
        productId: z.coerce.number().openapi({ example: 1 }),
        quantity: z.coerce.number().min(1).openapi({ example: 2 })
    })).min(1)
}).openapi('CreateOrderRequest');

const OrderItemSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
    product: z.object({
        id: z.number(),
        title: z.string(),
        image: z.string(),
        price: z.number(),
    }).passthrough() // Allow other fields like description, tags, etc.
});

const OrderResponseSchema = z.object({
    id: z.string().openapi({ example: 'ORD-1234' }),
    customerPhone: z.string(),
    total: z.number(),
    status: z.enum(['pending', 'completed', 'cancelled']),
    createdAt: z.string(),
    items: z.array(OrderItemSchema).optional(),
}).openapi('OrderResponse');

// Auth Middleware (DISABLED FOR DEV)
orderRoutes.use('*', async (c, next) => {
    /*
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const token = authHeader.split(' ')[1];
    const payload = await authService.verifyToken(token);
    if (!payload) return c.json({ error: 'Invalid token' }, 401);

    c.set('userId', payload.userId);
    */
    c.set('userId', 'dev-user-id');
    await next();
});

const createOrderRoute = createRoute({
    method: 'post',
    path: '/',
    security: [{ Bearer: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: orderSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: OrderResponseSchema,
                },
            },
            description: 'Order created',
        },
        400: {
            content: {
                'application/json': {
                    schema: z.object({ error: z.string() }),
                },
            },
            description: 'Invalid request',
        },
    },
});

const getMyOrdersRoute = createRoute({
    method: 'get',
    path: '/me',
    security: [{ Bearer: [] }],
    request: {
        query: z.object({
            phone: z.string().optional(),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(OrderResponseSchema),
                },
            },
            description: 'List of user orders',
        },
    },
});

orderRoutes.openapi(
    createOrderRoute,
    async (c) => {
        const userId = c.get('userId') as string;
        const request = c.req.valid('json');

        console.log('[order.routes] POST / validated body:', JSON.stringify(request, null, 2));

        try {
            const order = await orderService.placeOrder(userId, request);
            return c.json(mapOrder(order), 201);
        } catch (err: any) {
            console.error('[order.routes] placeOrder service error:', err);
            return c.json({ error: err.message }, 400);
        }
    },
    (result, c) => {
        if (!result.success) {
            console.error('[order.routes] Validation Failed:', JSON.stringify(result.error.format(), null, 2));
            return c.json({ error: 'Validation Failed', details: result.error.format() }, 400);
        }
    }
);

orderRoutes.openapi(getMyOrdersRoute, async (c) => {
    const userId = c.get('userId') as string;
    const { phone } = c.req.valid('query');

    if (phone) {
        const orders = await orderService.getOrdersByPhone(phone);
        return c.json(orders.map(mapOrder), 200);
    }

    const orders = await orderService.getUserOrders(userId);
    return c.json(orders.map(mapOrder), 200);
});
