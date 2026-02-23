import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { productRoutes } from '../src/presentation/routes/product.routes.js';
import { authRoutes } from '../src/presentation/routes/auth.routes.js';
import { orderRoutes } from '../src/presentation/routes/order.routes.js';
import { adminRoutes } from '../src/presentation/routes/admin.routes.js';

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'A to Z Foods API (Express)',
            version: '1.0.0',
            description: 'API for the A to Z Foods application',
        },
        servers: [{ url: '/api' }],
    },
    apis: ['./src/presentation/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors({
    origin: [
        'https://a-to-z-foods.vercel.app',
        'http://localhost:4200'
    ],
    credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('A to Z Foods API (Express) is Live 🚀');
});

// Swagger Documentation
app.use('/ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/doc.json', (req, res) => {
    res.json(swaggerSpec);
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
