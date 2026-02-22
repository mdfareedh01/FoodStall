import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { Product, CartItem } from '../services/mock-data.service';

type CartState = {
    items: CartItem[];
    loading: boolean;
};

const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('atoz_cart') || '[]'),
    loading: false,
};

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ items }) => ({
        count: computed(() => items().reduce((acc, item) => acc + item.quantity, 0)),
        total: computed(() => items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)),
    })),
    withMethods((store) => {
        // Persist to localStorage whenever items change
        effect(() => {
            localStorage.setItem('atoz_cart', JSON.stringify(store.items()));
        });

        return {
            addToCart(product: Product) {
                const items = store.items();
                const existingItem = items.find((item) => item.product.id === product.id);

                if (existingItem) {
                    patchState(store, {
                        items: items.map((item) =>
                            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        ),
                    });
                } else {
                    patchState(store, { items: [...items, { product, quantity: 1 }] });
                }
            },
            updateQuantity(productId: number, quantity: number) {
                if (quantity <= 0) {
                    patchState(store, {
                        items: store.items().filter((item) => item.product.id !== productId),
                    });
                    return;
                }
                patchState(store, {
                    items: store.items().map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            removeFromCart(productId: number) {
                patchState(store, {
                    items: store.items().filter((item) => item.product.id !== productId),
                });
            },
            clearCart() {
                patchState(store, { items: [] });
            },
        };
    })
);
