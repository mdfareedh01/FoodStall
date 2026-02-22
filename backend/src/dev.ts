import { serve } from '@hono/node-server'
import app from './index.js'

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Local development server running on http://localhost:${info.port}`)
    console.log(`Swagger UI available at http://localhost:${info.port}/ui`)
})
