import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env['JWT_SECRET'] || 'atozfoods-super-secret-key');

export class AuthService {
    async generateToken(userId: string, role: string) {
        return new SignJWT({ userId, role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);
    }

    async verifyToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            return payload as { userId: string, role: string };
        } catch {
            return null;
        }
    }
}
