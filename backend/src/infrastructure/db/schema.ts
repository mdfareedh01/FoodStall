import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // We'll use UUIDs or phone-based IDs
    phone: text('phone').notNull(),
    role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
}, (table) => ({
    phoneIdx: uniqueIndex('users_phone_idx').on(table.phone),
}));

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull().unique(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    image: text('image').notNull(),
    isVeg: integer('is_veg', { mode: 'boolean' }).notNull().default(true),
    category: text('category'),
    isSpecial: integer('is_special', { mode: 'boolean' }).notNull().default(false),
    origin: text('origin', { enum: ['Farm', 'Homemade', 'Standard'] }).notNull().default('Standard'),
    ingredients: text('ingredients'), // Store as JSON string ['a', 'b']
    tags: text('tags'), // Store as JSON string if needed, or comma-separated
    deletedAt: integer('deleted_at', { mode: 'timestamp' }), // For soft delete
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
}, (table) => ({
}));

export const orders = sqliteTable('orders', {
    id: text('id').primaryKey(), // Order ID (e.g. #ORD-1234)
    userId: text('user_id').notNull().references(() => users.id),
    customerPhone: text('customer_phone').notNull().default(''),
    total: real('total').notNull(),
    status: text('status', { enum: ['pending', 'completed', 'cancelled'] }).notNull().default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: text('order_id').notNull().references(() => orders.id),
    productId: integer('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    priceAtTime: real('price_at_time').notNull(),
});
