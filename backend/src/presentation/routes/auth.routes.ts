import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { randomUUID } from 'node:crypto';
import { AuthService } from '../../application/services/auth.service.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

const userRepository = new UserRepository();
const authService = new AuthService();

export const authRoutes = new OpenAPIHono();

const otpSchema = z.object({
    phone: z.string().min(10).openapi({ example: '1234567890' }),
}).openapi('OtpRequest');

const verifySchema = z.object({
    phone: z.string().min(10).openapi({ example: '1234567890' }),
    otp: z.string().length(4).openapi({ example: '1234' }),
}).openapi('VerifyRequest');

const authResponseSchema = z.object({
    token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    user: z.object({
        id: z.string(),
        phone: z.string(),
        role: z.string(),
    }),
}).openapi('AuthResponse');

const sendOtpRoute = createRoute({
    method: 'post',
    path: '/otp',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: otpSchema,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({ message: z.string().openapi({ example: 'OTP sent successfully' }) }),
                },
            },
            description: 'OTP sent response',
        },
    },
});

const verifyOtpRoute = createRoute({
    method: 'post',
    path: '/verify',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: verifySchema,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: authResponseSchema,
                },
            },
            description: 'Auth successful',
        },
        401: {
            content: {
                'application/json': {
                    schema: z.object({ error: z.string().openapi({ example: 'Invalid OTP' }) }),
                },
            },
            description: 'Auth failed',
        },
    },
});

authRoutes.openapi(sendOtpRoute, async (c) => {
    const { phone } = c.req.valid('json');
    console.log(`[MOCK] Sending OTP 1234 to ${phone}`);
    return c.json({ message: 'OTP sent successfully' }, 200);
});

authRoutes.openapi(verifyOtpRoute, async (c) => {
    const { phone, otp } = c.req.valid('json');

    if (otp !== '1234') {
        return c.json({ error: 'Invalid OTP' }, 401);
    }

    let user = await userRepository.findByPhone(phone);
    if (!user) {
        user = await userRepository.create({
            id: randomUUID(),
            phone,
            role: phone === '1234567890' ? 'admin' : 'user' // Hardcoded admin for testing
        });
    }

    const token = await authService.generateToken(user.id, user.role);
    return c.json({ token, user }, 200);
});
