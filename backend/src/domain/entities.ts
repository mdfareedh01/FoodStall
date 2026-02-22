import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { products, users, orders, orderItems } from '../infrastructure/db/schema.js';

// Database Models
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;

// DTOs & Business Interfaces
export interface ProductFilter {
    category?: string;
    isSpecial?: boolean;
    origin?: 'Farm' | 'Homemade' | 'Standard';
    search?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface CreateOrderRequest {
    customerPhone: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}
