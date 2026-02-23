import type { OrderRepository } from '../../infrastructure/repositories/order.repository.js';
import type { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import type { CreateOrderRequest, NewOrder, NewOrderItem, NewUser } from '../../domain/entities.js';
import type { UserRepository } from '../../infrastructure/repositories/user.repository.js';

export class OrderService {
    constructor(
        private orderRepo: OrderRepository,
        private productRepo: ProductRepository,
        private userRepo: UserRepository
    ) { }

    async placeOrder(userId: string, request: CreateOrderRequest) {
        // 1. Identify or Create the actual user for this phone
        let actualUserId = userId;

        // If it's a dev user or a new phone, we link it properly
        const existingUser = await this.userRepo.findByPhone(request.customerPhone);
        if (existingUser) {
            actualUserId = existingUser.id;
        } else {
            // Auto-create user for new phone
            actualUserId = `u-${request.customerPhone}`;
            await this.userRepo.create({
                id: actualUserId,
                phone: request.customerPhone,
                role: 'user'
            });
        }

        console.log(`[OrderService] Placing order for user: ${actualUserId} (originally ${userId})`);

        let total = 0;
        const items: NewOrderItem[] = [];

        for (const item of request.items) {
            const product = await this.productRepo.findById(item.productId);
            if (!product) {
                console.error(`[OrderService] Validation failure: Product ID ${item.productId} (${typeof item.productId}) NOT FOUND in database.`);
                throw new Error(`Product ${item.productId} not found`);
            }

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            items.push({
                orderId: '', // Will be set by repository
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: product.price
            });
        }

        const order: NewOrder = {
            id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            userId: actualUserId,
            customerPhone: request.customerPhone,
            total,
            status: 'pending'
        };

        await this.orderRepo.create(order, items);
        return this.orderRepo.findHydratedById(order.id);
    }

    async getUserOrders(userId: string) {
        return this.orderRepo.findAllHydratedByUserId(userId);
    }

    async getOrdersByPhone(phone: string) {
        const user = await this.userRepo.findByPhone(phone);
        if (!user) return [];
        return this.orderRepo.findAllHydratedByUserId(user.id);
    }

    async cancelOrder(orderId: string, phone: string) {
        const order = await this.orderRepo.findHydratedById(orderId);
        if (!order) throw new Error('Order not found');

        // Simple security check: phone must match
        if (order.customerPhone !== phone) {
            throw new Error('Not authorized to cancel this order');
        }

        if (order.status !== 'pending') {
            throw new Error(`Cannot cancel order in ${order.status} status`);
        }

        return this.orderRepo.updateStatus(orderId, 'cancelled');
    }
}
