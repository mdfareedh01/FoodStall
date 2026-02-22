import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { productRoutes } from './presentation/routes/product.routes.js'
import { authRoutes } from './presentation/routes/auth.routes.js'
import { orderRoutes } from './presentation/routes/order.routes.js'
import { adminRoutes } from './presentation/routes/admin.routes.js'

const app = new OpenAPIHono()

app.use('*', cors({
  origin: (origin) => {
    // In production, you'd put your vercel frontend URL here
    // For now allowing all to facilitate deployment
    return origin;
  },
  credentials: true,
}))

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }))

// OpenAPI Documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'A to Z Foods API',
    version: '1.0.0',
    description: 'API for the A to Z Foods application'
  }
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

app.get('/', (c) => {
  return c.text('A to Z Foods API is Live 🚀')
})

app.route('/api/products', productRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/orders', orderRoutes)
app.route('/api/admin', adminRoutes)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message || 'Internal Server Error' }, 500)
})

export default app
