import express from 'express';
import { randomUUID } from 'node:crypto';
import { AuthService } from '../../application/services/auth.service.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';

const userRepository = new UserRepository();
const authService = new AuthService();

export const authRoutes = express.Router();

const otpSchema = z.object({
    phone: z.string().min(10),
});

const verifySchema = z.object({
    phone: z.string().min(10),
    otp: z.string().length(4),
});

authRoutes.post('/otp', validate({ body: otpSchema }), async (req, res) => {
    const { phone } = req.body;
    console.log(`[MOCK] Sending OTP 1234 to ${phone}`);
    res.json({ message: 'OTP sent successfully' });
});

authRoutes.post('/verify', validate({ body: verifySchema }), async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (otp !== '1234') {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        let user = await userRepository.findByPhone(phone);
        if (!user) {
            user = await userRepository.create({
                id: randomUUID(),
                phone,
                role: phone === '1234567890' ? 'admin' : 'user'
            });
        }

        const token = await authService.generateToken(user.id, user.role);
        res.json({ token, user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
