import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { MockDataService, Order } from '../services/mock-data.service';
import { UserStore } from './user.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type OrderState = {
    orders: Order[];
    loading: boolean;
    error: string | null;
};

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const OrderStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, apiService = inject(MockDataService), userStore = inject(UserStore)) => {
        const loadOrders = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => {
                    const phone = userStore.user()?.phoneNumber;
                    return apiService.getOrders(phone).pipe(
                        tap((orders) => patchState(store, { orders, loading: false })),
                        tap({ error: (err) => patchState(store, { error: err.message, loading: false }) })
                    );
                })
            )
        );

        const loadAdminOrders = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => apiService.getAdminOrders().pipe(
                    tap((orders) => patchState(store, { orders, loading: false })),
                    tap({ error: (err) => patchState(store, { error: err.message, loading: false }) })
                ))
            )
        );

        return {
            loadOrders,
            loadAdminOrders,
            placeOrder: rxMethod<{ customerPhone: string, items: { productId: number, quantity: number }[] }>(
                pipe(
                    tap((req) => console.log('[OrderStore] placeOrder initiating:', req)),
                    tap(() => patchState(store, { loading: true, error: null })),
                    switchMap((request) => apiService.placeOrder(request).pipe(
                        tap((newOrder) => {
                            console.log('[OrderStore] order placement success:', newOrder);
                            patchState(store, {
                                orders: [newOrder, ...store.orders()],
                                loading: false
                            });
                        }),
                        tap({
                            error: (err) => {
                                console.error('[OrderStore] order placement error:', err);
                                patchState(store, { error: err.message, loading: false });
                            }
                        })
                    ))
                )
            ),
            updateStatus: rxMethod<{ orderId: string, status: 'pending' | 'completed' | 'cancelled' }>(
                pipe(
                    tap(() => patchState(store, { loading: true })),
                    switchMap(({ orderId, status }) => apiService.updateOrderStatus(orderId, status).pipe(
                        tap((updatedOrder) => patchState(store, {
                            orders: store.orders().map(o => o.id === updatedOrder.id ? updatedOrder : o),
                            loading: false
                        })),
                        tap({ error: (err) => patchState(store, { error: err.message, loading: false }) })
                    ))
                )
            ),
            cancelOrder: rxMethod<string>(
                pipe(
                    tap(() => patchState(store, { loading: true })),
                    switchMap((orderId) => {
                        const phone = userStore.user()?.phoneNumber;
                        if (!phone) {
                            patchState(store, { error: 'Phone number required to cancel', loading: false });
                            throw new Error('No phone found');
                        }
                        return apiService.cancelOrder(orderId, phone).pipe(
                            tap((updatedOrder) => patchState(store, {
                                orders: store.orders().map(o => o.id === updatedOrder.id ? updatedOrder : o),
                                loading: false
                            })),
                            tap({ error: (err) => patchState(store, { error: err.message, loading: false }) })
                        );
                    })
                )
            )
        };
    }),
    withHooks({
        onInit(store) {
            store.loadOrders();
        }
    })
);
