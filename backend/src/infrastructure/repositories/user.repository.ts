import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { User, NewUser } from '../../domain/entities.js';

export class UserRepository {
    async findByPhone(phone: string) {
        const result = await db.select().from(users).where(eq(users.phone, phone));
        return result[0];
    }

    async findById(id: string) {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
    }

    async create(user: NewUser) {
        const result = await db.insert(users).values(user).returning();
        return result[0];
    }
}
