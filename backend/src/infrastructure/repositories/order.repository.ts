import { db } from '../db/index.js';
import { orders, orderItems, products } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { Order, NewOrder, NewOrderItem } from '../../domain/entities.js';

export class OrderRepository {
    async create(order: NewOrder, items: NewOrderItem[]) {
        return db.transaction((tx: any) => {
            const newOrder = tx.insert(orders).values(order).returning().get();

            for (const item of items) {
                tx.insert(orderItems).values({
                    ...item,
                    orderId: newOrder.id
                }).run();
            }

            return newOrder;
        });
    }

    async findByUserId(userId: string) {
        return db.select().from(orders).where(eq(orders.userId, userId)).all();
    }

    async findAllHydratedByUserId(userId: string) {
        const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));

        const hydratedOrders = [];
        for (const order of userOrders) {
            const items = await db.select({
                productId: orderItems.productId,
                quantity: orderItems.quantity,
                priceAtTime: orderItems.priceAtTime,
                product: products,
            })
                .from(orderItems)
                .innerJoin(products, eq(orderItems.productId, products.id))
                .where(eq(orderItems.orderId, order.id));

            hydratedOrders.push({
                ...order,
                items
            });
        }
        return hydratedOrders;
    }

    async findHydratedById(orderId: string) {
        const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();
        if (!order) return null;

        const items = await db.select({
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            priceAtTime: orderItems.priceAtTime,
            product: products,
        })
            .from(orderItems)
            .innerJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, order.id));

        return { ...order, items };
    }

    async findAllHydrated() {
        const allOrders = await db.select().from(orders);

        const hydratedOrders = [];
        for (const order of allOrders) {
            const items = await db.select({
                productId: orderItems.productId,
                quantity: orderItems.quantity,
                priceAtTime: orderItems.priceAtTime,
                product: products,
            })
                .from(orderItems)
                .innerJoin(products, eq(orderItems.productId, products.id))
                .where(eq(orderItems.orderId, order.id));

            hydratedOrders.push({ ...order, items });
        }
        return hydratedOrders;
    }

    async updateStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
        const updatedOrder = db.update(orders)
            .set({ status })
            .where(eq(orders.id, orderId))
            .returning()
            .get();
        return this.findHydratedById(updatedOrder.id);
    }

    async getOrderItems(orderId: string) {
        return db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).all();
    }
}
