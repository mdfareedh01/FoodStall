import { db } from '../db/index.js';
import { products } from '../db/schema.js';
import { eq, and, like, or, isNull } from 'drizzle-orm';
import type { Product, ProductFilter, NewProduct } from '../../domain/entities.js';

export class ProductRepository {
    async findAll(filter?: ProductFilter) {
        let query = db.select().from(products);

        const conditions = [];
        conditions.push(isNull(products.deletedAt));

        if (filter?.category) conditions.push(eq(products.category, filter.category));
        if (filter?.isSpecial !== undefined) conditions.push(eq(products.isSpecial, filter.isSpecial));
        if (filter?.origin) conditions.push(eq(products.origin, filter.origin));
        if (filter?.search) {
            conditions.push(
                or(
                    like(products.title, `%${filter.search}%`),
                    like(products.description, `%${filter.search}%`)
                )
            );
        }

        if (conditions.length > 0) {
            // @ts-ignore - Drizzle query builder types are complex
            return query.where(and(...conditions)).all();
        }

        return query.all();
    }

    async findById(id: number) {
        return db.select().from(products).where(eq(products.id, id)).get();
    }

    async create(product: NewProduct) {
        const result = await db.insert(products).values(product).returning();
        return result[0];
    }

    async update(id: number, product: Partial<NewProduct>) {
        const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
        return result[0];
    }

    async softDelete(id: number) {
        return db.update(products)
            .set({ deletedAt: new Date() })
            .where(eq(products.id, id));
    }

    async delete(id: number) {
        return db.delete(products).where(eq(products.id, id));
    }
}
